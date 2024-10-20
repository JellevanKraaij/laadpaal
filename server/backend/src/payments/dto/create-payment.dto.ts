import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  cardId: string;
  @IsNumber()
  whPaid: number;
  @IsString()
  @IsOptional()
  description?: string;
}
