import {IsEmail, IsNotEmpty, IsString, MaxLength, MinLength} from 'class-validator';

export class AddModeratorDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(35)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(9)
  tel: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;
}
