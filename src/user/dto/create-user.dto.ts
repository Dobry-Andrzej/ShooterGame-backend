export class CreateUserDTO {
    readonly name: string;
    readonly surname: string;
    readonly login: string;
    readonly password: string;
    readonly email: string;
    readonly admin: boolean;
}
