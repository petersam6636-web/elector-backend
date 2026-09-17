import {Min, Max, IsString, IsEmail,} from 'class-validator';
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @Min(5)
  @Max(30)
  password: string;
}