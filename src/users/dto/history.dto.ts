import { IsString, IsNumber } from 'class-validator';

export class HistoryDto {
  @IsString()
  header: string;

  @IsString()
  content: string;

  @IsNumber()
  userId: number;


}