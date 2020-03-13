import { Injectable } from '@nestjs/common';
import {UserService} from "../user/user.service";

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {}

    async validateUser(login: string, pass: string): Promise<any> {
        const user = await this.userService.getUserByLogin(login);

        if (user && user.password === pass) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
}
