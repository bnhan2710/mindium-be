import { IsString, IsNotEmpty } from 'class-validator';
export class ExchangeGoogleTokenDto {
  @IsString()
  @IsNotEmpty()
  code: string;
} 