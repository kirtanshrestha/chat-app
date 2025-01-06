import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(20)
    password: string;

    @IsString()
    @MinLength(1)
    name: string;

    @IsString()
    @MinLength(2)
    username: string;
}
