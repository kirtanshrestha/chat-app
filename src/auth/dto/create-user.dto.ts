import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength, IsNumber, IsOptional } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({
        description: "The user's email address",
        example: 'john.doe@gmail.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: "The user's password (6-20 characters)",
        example: 'securePassword123',
        minLength: 6,
        maxLength: 20,
    })
    @IsString()
    @MinLength(6)
    @MaxLength(20)
    password: string;

    @ApiProperty({
        description: "The user's full name",
        example: 'John Doe',
    })
    @IsString()
    @MinLength(1)
    name: string;

    @ApiProperty({
        description: 'The unique username of the user',
        example: 'john_doe',
    })
    @IsString()
    @MinLength(1)
    username: string;


    @IsNumber()
    @IsOptional()
    balance?: number;

    @IsOptional()
    isEmailVerified?: boolean;

    @IsOptional()
    otp?: number;
}
