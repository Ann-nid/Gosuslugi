import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateRequestDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  serviceId: number;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsOptional()
  comment?: string;
}