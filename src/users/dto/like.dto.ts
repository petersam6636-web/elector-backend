import {IsString, IsNumber} from 'class-validator';
export class LikesDto {
  @IsString()
  userName: string;

  @IsString()
  comment: string;

  @IsNumber()
  nomineeId: number

  @IsNumber()
  userId: number
}