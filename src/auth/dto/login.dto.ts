import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  
  @IsEmail()
  @ApiProperty({ example: 'user@gmail.com', description: 'The email of the user' })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ example: 'password123', description: 'The password of the user', minLength: 6 })
  password: string;
}
