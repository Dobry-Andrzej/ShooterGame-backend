import { Injectable } from '@nestjs/common';
import {UserService} from "../user/user.service";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async validateUser(login: string, pass: string): Promise<any> {
        const user = await this.userService.findUserByLogin(login, pass);
        if (user && user.password === pass) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { login: user.login, sub: user._id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
