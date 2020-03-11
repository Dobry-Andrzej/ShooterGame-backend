import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './interfaces/user.interface';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UserService {

    constructor(@InjectModel('User') private readonly userModel: Model) {}

    async getUsers() {
        const users = await this.userModel.find().exec();
        return users;
    }

    async getUser(id) {
        const user = await this.userModel.findById(id).exec();
        return user;
    }

    async createUser(createUserDTO: CreateUserDTO): Promise<User> {
        const newUser = await this.userModel(createUserDTO);
        return newUser.save();
    }

    async editUser(id, createUserDTO: CreateUserDTO): Promise<User> {
        const editedUser = await this.userModel.findByIdAndUpdate(id, createUserDTO, {new: true});
        return editedUser;
    }

    async deleteUser(id) {
        const deletedUser = await this.userModel.findByIdAndRemove(id);
        return deletedUser;
    }
}
