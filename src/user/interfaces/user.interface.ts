import { Document } from 'mongoose';

export interface User extends Document {
    readonly name: string;
    readonly surname: string;
    readonly login: string;
    readonly password: string;
    readonly email: string;
    readonly admin: boolean;
}
