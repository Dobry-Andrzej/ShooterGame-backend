import {
  IsBoolean,
  IsEmail, IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  ValidationArguments,
} from 'class-validator';
import { UserRole } from '../../../utils/types';
import { Match } from '../../decorators/match-in-dto.decorator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(35)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Match('password', {
    message: (args: ValidationArguments) => {
      return `Passwords must match`;
    },
  })
  password2: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(9)
  tel: string;
}
