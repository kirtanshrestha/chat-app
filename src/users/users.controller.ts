import { Controller, Get, Param, Put, Body, UseGuards, Patch, Post, Delete, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { Room } from 'src/rooms/entities/room.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }


    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.usersService.create(createUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@Req() req) {
        return this.usersService.findByUsername(req.user.username);
    }

    // Get user by ID
    @Get('id/:id')
    async findById(@Param('id') id: number): Promise<User> {
        return this.usersService.findById(id);
    }

    async findByEmailforLogin(@Param('email') email: string): Promise<User> {
        return this.usersService.findByEmailforLogin(email);
    }

    @Get('email/:email')
    async findByEmail(@Param('email') email: string): Promise<User> {
        return this.usersService.findByEmail(email);
    }

    async finByUsernameforLogin(@Param('username') username: string): Promise<User | object> {
        return this.usersService.findByUsernameforLogin(username);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':username')
    async finByUsername(@Param('username') username: string): Promise<User | object> {
        return this.usersService.findByUsername(username);
    }

    @UseGuards(JwtAuthGuard)
    @Post('payment')
    async createPayment(@Body('amount') amount: number, @Body('receiver') receiver: string, @Req() req) {
        return this.usersService.createPayment(amount, receiver, req.user.username);
    }

    @Get('updatePayment/:receiver/:amount')
    async updatePayment(@Param('receiver') receiver: string, @Param('amount') amount: number) {
        return this.usersService.updatePayment(receiver, amount, 'user1');
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<User> {
        return this.usersService.update(id, updateUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':username')
    async remove(@Req() req, @Param('username') username: string): Promise<object> {
        return this.usersService.remove(req, username);
    }
}
