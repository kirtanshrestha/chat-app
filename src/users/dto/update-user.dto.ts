import { IsString, MinLength, IsOptional } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @MinLength(3)
    @IsOptional()
    username?: string;

    @IsString()
    @MinLength(6)
    @IsOptional()
    password?: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsOptional()
    isActive?: boolean;
}
