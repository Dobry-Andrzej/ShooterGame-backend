import {IsNotEmpty, IsString, MinLength} from 'class-validator';
import { Match } from '../../decorators/match-in-dto.decorator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Match('password')
  password2: string;
}
