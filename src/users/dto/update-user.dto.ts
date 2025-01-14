import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class UpdateUserDto {

    @ApiProperty({
        description: 'The username of the user. Optional, can be updated for the user.',
        example: 'new_username',
        required: false
    })
    @IsString()
    @MinLength(3)
    @IsOptional()
    username?: string;

    @ApiProperty({
        description: 'The password of the user. Optional, can be updated for the user.',
        example: 'newPassword123',
        required: false
    })
    @IsString()
    @MinLength(6)
    @IsOptional()
    password?: string;

    @ApiProperty({
        description: 'The full name of the user. Optional, can be updated for the user.',
        example: 'John Doe',
        required: false
    })
    @IsString()
    @IsOptional()
    name?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;


    @IsOptional()
    @IsBoolean()
    isEmailVerified?: boolean;

  
    @IsOptional()
    @IsNumber()
    otp?: number;
}
