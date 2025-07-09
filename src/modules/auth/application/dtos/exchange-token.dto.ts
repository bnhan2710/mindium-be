import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
export class ExchangeGoogleTokenDto {
	@ApiProperty({
		description: 'The Google OAuth token to be exchanged for application tokens',
		example: 'your-google-oauth-token-here',
	})
	@IsString()
	@IsNotEmpty()
	code: string;
}
