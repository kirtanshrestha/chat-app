import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('messages')
export class MessagesController {
    constructor(
        private readonly messagesService: MessagesService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createMessage(
        @Body('content') content: string,
        @Body('roomId') roomId: string,
        @Req() req
    ) {
        return this.messagesService.create(content, req.user.id, roomId);
    }

    // @Post(':username')
    // async createDM(
    //     @Body('content') content: string,
    //     @Req() req,
    //     @Param('username') username: string,
    // ) {

    // }

    @Get(':roomId')
    async findMessageByRoom(@Param('roomId') roomId: string) {
        return this.messagesService.findMessageByRoom(roomId);
    }
}
