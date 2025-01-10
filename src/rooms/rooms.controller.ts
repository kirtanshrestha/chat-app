import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from './entities/room.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('rooms')
export class RoomsController {
    constructor(
        private readonly roomsService: RoomsService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createRoom(@Req() req, @Body() createRoomDto: CreateRoomDto): Promise<Room> {
        return this.roomsService.createRoom(req, createRoomDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('chat/:receiver')
    async createChat(@Req() req, @Param('receiver') receiverId: number): Promise<Room> {
        return this.roomsService.createChat(req.user.id, receiverId);
    }


    @Get(':name')
    async findRoomByName(@Param('name') name: string): Promise<Room> {
        return await this.roomsService.findRoomByName(name);
    }


    @UseGuards(JwtAuthGuard)
    @Get('leave/:id')
    async leaveRoom(@Req() req, @Param('id') roomId: string) {
        return await this.roomsService.leaveRoom(req.user.id, roomId);
    }
    @UseGuards(JwtAuthGuard)
    @Get('join/:id')
    async joinRoom(@Req() req, @Param('id') roomId: string) {
        return await this.roomsService.joinRoom(req.user.id, roomId);
    }


    @Get('users/:id')
    async findRoomsByUserid(@Param('id') id: number): Promise<Room[]> {
        return await this.roomsService.findRoomByUserid(id);
    }
    @Get('id/:id')
    async findRoomById(@Param('id') id: string): Promise<Room> {
        return await this.roomsService.findRoomById(id);
    }

    @Get()
    async findAll(): Promise<Room[]> {
        return this.roomsService.findAll();
    }

}
