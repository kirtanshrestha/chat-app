import { Controller, Get, Param, Put, Body, UseGuards, Patch, Post, Delete, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';

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

    // Get user by ID
    @Get('id/:id')
    async findOne(@Param('id') id: number): Promise<User> {
        return this.usersService.findById(id);
    }

    @Get('email/:email')
    async findByEmail(@Param('email') email: string): Promise<User> {
        return this.usersService.findByEmail(email);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':username')
    async finByUsername(@Param('username') username: string): Promise<User | object> {
        return this.usersService.findByUsername(username);
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
