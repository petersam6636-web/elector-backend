import {Min, Max, IsString, IsEmail,} from 'class-validator';
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}