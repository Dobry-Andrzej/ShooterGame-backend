import {IsNotEmpty, IsString} from 'class-validator';

export class ResetPassRequestDto {
    @IsNotEmpty()
    @IsString()
    email: string;
}
