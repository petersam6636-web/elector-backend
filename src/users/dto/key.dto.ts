import { IsString, IsNumber } from 'class-validator';

export class KeyDto {
  @IsString()
  userKey: string;

  @IsNumber()
  userId: number;

  @IsString()
  expireDate: number;
}