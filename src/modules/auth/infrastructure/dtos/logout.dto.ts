import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class LogoutDto {
  @ApiProperty({
    description: 'The refresh token to be used for logging out',
    example: 'your-refresh-token-here',
  })
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
} 