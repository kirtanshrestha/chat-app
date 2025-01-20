import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from './entities/room.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('rooms')
export class RoomsController {
    constructor(
        private readonly roomsService: RoomsService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new room' })
    @ApiResponse({ status: 201, description: 'New room successfully created', type: Room })
    @ApiResponse({ status: 400, description: 'unable to creater room' })
    async createRoom(@Req() req, @Body() createRoomDto: CreateRoomDto): Promise<Room> {
        return this.roomsService.createRoom(req, createRoomDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('chat/id/:receiver')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create private chat between other user.' })
    @ApiResponse({ status: 200, description: 'Room successfuly created/fetched', type: Room })
    @ApiResponse({ status: 401 })
    @ApiParam({ name: 'receiver', description: 'The ID of the receiving user', example: 1 })
    async createChat(@Req() req, @Param('receiver') receiverId: number): Promise<Room> {
        return this.roomsService.createChat(req.user.id, receiverId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('chat/:username')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create private chat between other user.' })
    @ApiResponse({ status: 200, description: 'Room successfuly created/fetched', type: Room })
    @ApiResponse({ status: 401 })
    @ApiParam({ name: 'username', description: 'The username of the receiving user', example: 'kirtan_work' })
    async createChatUsername(@Req() req, @Param('username') username: string): Promise<Room> {
        return this.roomsService.createChatUsername(req.user.id, username);
    }



    @Get(':name')
    @ApiOperation({ summary: 'Find room by its name' })
    @ApiResponse({ status: 200, description: 'Room successfuly found', type: Room })
    @ApiResponse({ status: 404, description: 'no such room' })
    async findRoomByName(@Param('name') name: string): Promise<Room> {
        return await this.roomsService.findRoomByName(name);
    }

    @UseGuards(JwtAuthGuard)
    @Get('leave/:id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Leave a room' })
    @ApiResponse({ status: 200, description: 'romm left', type: Room })
    @ApiResponse({ status: 401 })
    @ApiParam({ name: 'id', description: 'The ID of the room to leave', example: 'adsuihad213adsyfiuhfa' })
    async leaveRoom(@Req() req, @Param('id') roomId: string) {
        return await this.roomsService.leaveRoom(req.user.id, roomId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('join/:id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Join a room' })
    @ApiResponse({ status: 200, description: 'room joined', type: Room })
    @ApiResponse({ status: 401 })
    @ApiResponse({ status: 404, description: 'no such room' })
    @ApiParam({ name: 'id', description: 'The ID of the room to join', example: 'adsuihad213adsyfiuhfa' })
    async joinRoom(@Req() req, @Param('id') roomId: string) {
        return await this.roomsService.joinRoom(req.user.id, roomId);
    }

    @Get('users/:id')
    @ApiOperation({ summary: 'Find all rooms where user  belongs' })
    @ApiResponse({ status: 200, description: 'room joined', type: Array<Room> })
    @ApiResponse({ status: 401 })
    @ApiResponse({ status: 404, description: 'no user found' })
    @ApiParam({ name: 'id', description: 'The ID of the user', example: 1 })
    async findRoomsByUserid(@Param('id') id: number): Promise<Room[]> {
        return await this.roomsService.findRoomByUserid(id);
    }

    @Get('id/:id')
    @ApiOperation({ summary: 'Find a room by its id' })
    @ApiResponse({ status: 200, description: 'Room found', type: Room })
    @ApiResponse({ status: 401 })
    @ApiResponse({ status: 404, description: 'no such room' })
    @ApiParam({ name: 'id', description: 'The ID of the room ', example: 'adsuihad213adsyfiuhfa' })
    async findRoomById(@Param('id') id: string): Promise<Room> {
        return await this.roomsService.findRoomById(id);
    }

    @Get()
    @ApiOperation({ summary: 'Display all rooms' })
    @ApiResponse({ status: 200, description: 'rooms fetched', type: Array<Room> })
    @ApiResponse({ status: 401 })
    @ApiResponse({ status: 404, description: 'no room' })

    async findAll(): Promise<Room[]> {
        return this.roomsService.findAll();
    }
}
