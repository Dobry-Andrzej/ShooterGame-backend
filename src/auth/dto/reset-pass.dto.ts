import {IsNotEmpty, IsString, MinLength} from 'class-validator';
import { Match } from '../../decorators/match-in-dto.decorator';

export class ResetPassDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @Match('password')
    password2: string;

    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsString()
    updateToken: string;
}
