import { Controller, Post, Body, HttpCode, HttpStatus, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)  // Sets HTTP status code to 200 for successful login
    async login(@Body() loginDto: LoginDto): Promise<{ accessToken?: string, msg?: string }> {
        return this.authService.login(loginDto);
    }

    @Get('verify-email')
    async verifyEmail(@Query('token') token: string) {
        const message = await this.authService.verifyEmail(token);
        return { message };
    }

    @Post('verify-email')
    async verifyEmailWithOtp(@Body() body) {
        const { email, otp } = body;
        const message = await this.authService.verifyOtp(email, otp);
        return { message };
    }
}