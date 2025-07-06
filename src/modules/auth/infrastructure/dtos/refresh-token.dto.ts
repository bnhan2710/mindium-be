import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
        description: 'The refresh token to be used for refreshing the session',
        example: 'your-refresh-token-here',
  })
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
} 