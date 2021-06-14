import {
  Body,
  Controller, Get,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe, Patch,
  Post,
  Put,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserObj } from '../decorators/get-user.decorator';
import { User } from './user.schema';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from '../../utils/types';
import { AddModeratorDto } from './dto/add-moderator.dto';
import { TransFn } from '../decorators/transalate.decorator';
import {ResetPassRequestDto} from './dto/reset-pass-request.dto';
import {ResetPassDto} from './dto/reset-pass.dto';
import {UseRoles} from "../decorators/useRole.decorator";
import {HasRoleGuard} from "../../guard/hasRole.guard";

@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');

  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) registerDto: RegisterDto,
  ): Promise<void> {
    this.logger.warn(
      `Signing up with credentials ${JSON.stringify(registerDto.email)}`,
    );
    return this.authService.signUp(registerDto);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    this.logger.warn(
      `Signing in with credentials ${JSON.stringify(authCredentialsDto.email)}`,
    );
    return this.authService.signIn(authCredentialsDto);
  }

  @Put('/change-password/:id')
  @UseGuards(AuthGuard())
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Res() res,
    @Param('id', ParseIntPipe) id: number,
    @UserObj() userMe: User,
  ): Promise<void> {
    await this.authService.changePassword(id, changePasswordDto, userMe);
    return res.status(HttpStatus.OK).json({
      message: 'Password changed successfully!',
    });
  }

  @Post('/add-moderator')
  @UseGuards(AuthGuard(), HasRoleGuard)
  @UseRoles(UserRole.Admin)
  async addModerator(
    @Body(ValidationPipe) addModeratorDto: AddModeratorDto,
    @Res() res,
    @TransFn() __: (text: string, args?: any) => string,
  ): Promise<void> {
    this.logger.warn(
      `Adding moderator ${JSON.stringify(addModeratorDto.email)}`,
    );
    await this.authService.addModerator(addModeratorDto, __);
    return res.status(HttpStatus.OK).json({
      message: 'Added moderator successfully!',
    });
  }

  @Post('/reset-pass-request')
  async resetPassRequest(
      @Body(ValidationPipe) resetPassRequestDto: ResetPassRequestDto,
      @Res() res,
      @TransFn() __: (text: string, args?: any) => string,
  ): Promise<void> {
    this.logger.warn(
        `Reset pass requesting for ${JSON.stringify(resetPassRequestDto.email)}`,
    );
    await this.authService.resetPassLinkRequest(resetPassRequestDto, __);
    return res.status(HttpStatus.OK).json({
      message: 'Pass requested successfully!',
    });
  }

  @Patch('/set-new-pass')
  async setPass(
      @Body(ValidationPipe) resetPassDto: ResetPassDto,
      @Res() res,
  ): Promise<void> {
    this.logger.warn(
        `Setting new pass from requested link ${JSON.stringify(resetPassDto.userId)}`,
    );
    const { password2, ...payload } = resetPassDto;
    await this.authService.setPassChange(payload);
    return res.status(HttpStatus.OK).json({
      message: 'Password changed successfully!',
    });
  }
}
