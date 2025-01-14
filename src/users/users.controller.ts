import { Controller, Get, Param, Put, Body, UseGuards, Patch, Post, Delete, Req, Res, forwardRef, Inject } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { ApiBearerAuth, ApiBody, ApiExcludeEndpoint, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService,
        @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
    ) { }


    @Post()
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User registered successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async create(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }



    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiBearerAuth() // Indicate that this route requires authentication
    @ApiOperation({ summary: 'Get all user profile' })
    @ApiResponse({ status: 200, description: 'Returns user profile.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    @ApiBearerAuth() // Indicate that this route requires authentication
    @ApiOperation({ summary: 'Get user profile' })
    @ApiResponse({ status: 200, description: 'Returns user profile.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    getProfile(@Req() req) {
        return this.usersService.findByUsername(req.user.username);
    }

    // Get user by ID
    @Get('id/:id')
    @ApiOperation({ summary: 'Find user by ID' })
    @ApiParam({ name: 'id', description: 'The ID of the user', example: 1 })
    @ApiResponse({ status: 200, description: 'User found', type: User })
    @ApiResponse({ status: 404, description: 'User not found' })
    async findById(@Param('id') id: number): Promise<User> {
        return this.usersService.findById(id);
    }

    @ApiExcludeEndpoint()
    async findByEmailforLogin(@Param('email') email: string): Promise<User> {
        return this.usersService.findByEmailforLogin(email);
    }

    @ApiExcludeEndpoint()
    async finByUsernameforLogin(@Param('username') username: string): Promise<User | object> {
        return this.usersService.findByUsernameforLogin(username);
    }

    @Get('email/:email')
    @ApiOperation({ summary: 'Find user by email' })
    @ApiParam({ name: 'email', description: 'The email of the user', example: 'user@example.com' })
    @ApiResponse({ status: 200, description: 'User found', type: User })
    @ApiResponse({ status: 404, description: 'User not found' })
    async findByEmail(@Param('email') email: string): Promise<User> {
        return this.usersService.findByEmail(email);
    }


    @UseGuards(JwtAuthGuard)
    @Get(':username')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Find user by username' })
    @ApiParam({ name: 'username', description: 'The username of the user', example: 'user@example.com' })
    @ApiResponse({ status: 200, description: 'User found', type: User })
    @ApiResponse({ status: 404, description: 'User not found' })
    async finByUsername(@Param('username') username: string): Promise<User | object> {
        return this.usersService.findByUsername(username);
    }

    @UseGuards(JwtAuthGuard)
    @Post('payment')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a payment' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                amount: { type: 'number', example: 100 },
                receiver: { type: 'string', example: 'kirtan_stha' },
            },
        },
    })
    @ApiResponse({ status: 201, description: 'Payment created successfully' })
    async createPayment(@Body('amount') amount: number, @Body('receiver') receiver: string, @Req() req) {
        return this.usersService.createPayment(amount, receiver, req.user.username);
    }


    @ApiExcludeEndpoint()
    @Get('updatePayment/:sender/:receiver/:amount/:mode')
    async updatePayment(@Res() res, @Param('sender') sender: string, @Param('receiver') receiver: string, @Param('amount') amount: number, @Param('mode') mode: string) {
        this.usersService.updatePayment(receiver, amount, sender, mode);
        return res.redirect('http://localhost:3000');
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Put(':id')
    @ApiOperation({ summary: 'Update user details.' })
    @ApiParam({ name: 'id', description: 'The id of the user to be edited.', example: 1 })
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({ status: 200, description: 'User updated.', type: User })
    async update(
        @Param('id') id: number,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<User> {
        return this.usersService.update(id, updateUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a user by username' })
    @ApiParam({ name: 'username', description: 'The username of the user', example: 'user1' })
    @ApiResponse({ status: 200, description: 'User deleted successfully' })
    @Delete(':username')
    async remove(@Req() req, @Param('username') username: string): Promise<object> {
        return this.usersService.remove(req, username);
    }
}
