import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {User} from './interfaces/user.interface';
import {CreateUserDTO} from './dto/create-user.dto';

@Injectable()
export class UserService {

    constructor(@InjectModel('User') private readonly userModel: Model) {}

    errors = '';

    async getUsers() {
        return await this.userModel.find().exec();
    }

    async getUser(id) {
        return await this.userModel.findById(id).exec();
    }

    async findUserByLogin(login: string, pass: string) {
        const user = this.userModel.findOne({login: login, password: pass},
            function(err,obj) {
        });
        if (!user) {
            throw new NotFoundException('Wrong login or password.');
        }
        return user;
    }

    async createUser(createUserDTO: CreateUserDTO): Promise<User> {
        if ((await this.userModel.findOne({login: createUserDTO.login}))) {
            throw new ConflictException('This username is registered already!');
        } else if ((await this.userModel.findOne({email: createUserDTO.email}))) {
            throw new ConflictException('Email address is registered!');
        }
        const newUser = await this.userModel(createUserDTO);
        return newUser.save();
    }

    async editUser(id, createUserDTO: CreateUserDTO): Promise<User> {
        return await this.userModel.findByIdAndUpdate(id, createUserDTO, {new: true});
    }

    async deleteUser(id) {
        return await this.userModel.findByIdAndRemove(id);
    }
}
