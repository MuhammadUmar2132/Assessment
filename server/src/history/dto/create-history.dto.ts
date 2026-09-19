import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateHistoryDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsNumber()
  scrollY?: number;
}

