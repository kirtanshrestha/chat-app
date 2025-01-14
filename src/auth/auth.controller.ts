import { Controller, Post, Body, HttpCode, HttpStatus, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ApiBody, ApiExcludeEndpoint, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }


    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User registered successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login for existing user' })
    @ApiResponse({ status: 200, description: 'Logged in successfully' })
    @ApiResponse({ status: 401, description: 'Invalid email or password combination' })
    @ApiResponse({ status: 404, description: 'No user with give email' })
    @ApiResponse({ status: 401, description: 'Email not verified yet.' })
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto): Promise<{ accessToken?: string, msg?: string }> {
        return this.authService.login(loginDto);
    }

    @ApiExcludeEndpoint()
    @Get('verify-email')
    async verifyEmail(@Query('token') token: string) {
        const message = await this.authService.verifyEmail(token);
        return { message };
    }

    @Post('verify-email')
    @ApiOperation({ summary: 'Otp verification' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                otp: { type: 'string', example: 123456 },
                email: { type: 'string', example: 'xyz@gmail.com' },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'email verified' })
    @ApiResponse({ status: 200, description: 'email already verified' })
    @ApiResponse({ status: 401, description: 'Invalid otp' })
    async verifyEmailWithOtp(@Body() body) {
        const { email, otp } = body;
        const message = await this.authService.verifyOtp(email, otp);
        return { message };
    }
}