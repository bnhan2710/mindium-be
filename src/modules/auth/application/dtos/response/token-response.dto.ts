import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class TokenResponseDto {
    @ApiProperty({
        description: "The access token for the user",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    })
    @IsString()
    @IsNotEmpty()
    access_token: string;

    @ApiProperty({
        description: "The refresh token for the user",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    })
    @IsString()
    @IsNotEmpty()
    refresh_token: string;

    @ApiProperty({
        description: "The user ID associated with the token",
        example: "67b1989f3eb9760dc242eb78",
    })
    sub: string;

}  