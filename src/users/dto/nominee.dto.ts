import {IsNotEmpty, IsString, IsNumber} from 'class-validator';
export class nomineeDto {
 
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  menufesto: string;

  @IsNumber()
  userId: number;
}