import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {User} from './user.schema';
import {JwtPayload} from './jwt-payload.interface';
import {AuthCredentialsDto} from './dto/auth-credentials.dto';
import {ChangePasswordDto} from './dto/change-password.dto';
import {RegisterDto} from './dto/register.dto';
import {AddModeratorDto} from './dto/add-moderator.dto';
import {ResetPassRequest, UserRole} from '../../utils/types';
import {uuid} from 'uuidv4';
import * as bcrypt from 'bcryptjs';
import {MailService} from '../mail/mail.service';
import {addedFirstSettingPassLayout} from '../../template/email/added-set-first-pass';
import {ResetPassRequestDto} from './dto/reset-pass-request.dto';
import {resetPassRequestLayout} from '../../template/email/reset-pass-request';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User>,
    private jwtService: JwtService,
    @Inject(forwardRef(() => MailService))
    private mailService: MailService,
  ) {}

  async removeTokenId(user: User) {
    user.currentTokenId = '';
    await user.save();
  }

  async signUp(registerDto: RegisterDto): Promise<void> {
    return this.addUser(registerDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const user = await this.validateUserPassword(
      authCredentialsDto,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    const payload: JwtPayload = { email: user };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) {
      throw new NotFoundException(`User with ID: "${id}" doesn't exist!`);
    }
    return user;
  }

  async changePassword(
    id: number,
    changePasswordDto: ChangePasswordDto,
    userMe: User,
  ): Promise<void> {
    if (!userMe) {
      throw new NotFoundException(`You aren't registered!`);
    }
    const userFromDB = await this.getUserById(id);

    if (userMe.id !== userFromDB.id) {
      throw new NotFoundException(`You can't change someones password!`);
    }
    await this.changePasswordInDB(userFromDB, changePasswordDto);
  }

  async addModerator(
    addModeratorDto: AddModeratorDto,
    __: (text: string, args?: any) => string,
  ): Promise<void> {
    const role = UserRole.Moderator;
    const user = await this.addModeratorToDB(addModeratorDto, role);
    await this.mailService.sendMail(
      `${user.email}`,
      `${__('added_as_moderator')}`,
      addedFirstSettingPassLayout(
        `${user.firstName} ${user.lastName}`,
        user.id,
        user.updateToken,
        __,
      ),
    );
  }

  async resetPassLinkRequest(
      resetPassRequestDto: ResetPassRequestDto,
      __: (text: string, args?: any) => string,
  ): Promise<void> {
    const { email } = resetPassRequestDto;
    const user = await this.userModel.findOne({ email });

    if (
        user &&
        (!user.changePassToken || !user.changePassTokenValidTill || user.changePassTokenValidTill < new Date())
    ) {
      const changePassToken = uuid();
      user.changePassToken = changePassToken;
      const dt = new Date();
      dt.setDate(dt.getDate() + 1);
      user.changePassTokenValidTill = dt;

      await user.save();
      await this.mailService.sendMail(
          user.email,
          `${__('reset_pass_request')}`,
          resetPassRequestLayout(`${user.firstName} ${user.lastName}`, user.id, changePassToken, __),
      );
    }
  }

  async setPassChange(resetPassRequest: ResetPassRequest): Promise<void> {
    const user = await this.userModel.findOne( { _id: resetPassRequest.userId } )
        .select({ salt: 1, changePassToken: 1 });

    if (!user) {
      throw new NotFoundException(`User not found!`);
    }
    if (
        !resetPassRequest.updateToken ||
        resetPassRequest.updateToken.trim() === '' ||
        !user.changePassToken ||
        user.changePassToken.trim() === '' ||
        user.changePassToken !== resetPassRequest.updateToken
    ) {
      throw new UnauthorizedException('Invalid token!');
    }

    user.password = await this.hashPassword(resetPassRequest.password, user.salt);
    user.changePassToken = null;
    user.changePassTokenValidTill = null;

    console.log(user);
    await user.save();
    await this.removeTokenId(user);
  }

  async addUser(registerDto: RegisterDto): Promise<void> {
    const { email, password, firstName, lastName } = registerDto;

    if (await this.checkIfUserIsInDb(registerDto.email, registerDto.tel)) {
      throw new ConflictException('Email is already taken');
    }

    const user = new this.userModel();

    user.email = email;

    user.salt = await bcrypt.genSalt();
    user.role = UserRole.User;
    user.tel = registerDto.tel;
    user.accountCreatedDt = new Date();
    user.firstName = firstName;
    user.lastName = lastName;
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email is already taken');
      } else {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async addModeratorToDB(
      addModeratorDto: AddModeratorDto,
      role: UserRole,
  ): Promise<User> {
    const { email, firstName, lastName } = addModeratorDto;

    if (await this.checkIfUserIsInDb(addModeratorDto.email, addModeratorDto.tel)) {
      throw new ConflictException('Email is already taken');
    }
    const user = new this.userModel();

    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.tel = addModeratorDto.tel;
    user.role = role;
    user.accountCreatedDt = new Date();
    user.firstName = firstName;
    user.lastName = lastName;
    user.updateToken = uuid();

    try {
      await user.save();
      return user;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email is already taken');
      } else {
        console.warn(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async changePasswordInDB(
      user: User,
      changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const { password, password2 } = changePasswordDto;
    if (password !== password2) {
      throw new ConflictException('Passwords are different');
    }
    user.password = await this.hashPassword(password, user.salt);

    await user.save();
  }

  async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async validateUserPassword(
      authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const { email, password } = authCredentialsDto;

    const user = await this.userModel.findOne({ email }).select({ password: 1, salt: 1, email: 1 }).exec();

    if (user && (await this.validatePassword(password, user.salt, user.password))) {
      return user.email;
    } else {
      return null;
    }
  }

  async validatePassword(password: string, salt: string, userPass: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, salt);
    return hash === userPass;
  }

  async checkIfUserIsInDb(email: string, tel: string): Promise<boolean> {
      return !!(await this.userModel.findOne({
        $or:
            [
              {email},
              {tel},
            ],
      }));
  }
}
