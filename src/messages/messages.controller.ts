import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Message')
@Controller('messages')
export class MessagesController {
    constructor(
        private readonly messagesService: MessagesService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'Create a new message' })
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                content: { type: 'string' },
                roomId: { type: 'string' }
            },
            required: ['content', 'roomId']
        }
    })
    async createMessage(
        @Body('content') content: string,
        @Body('roomId') roomId: string,
        @Req() req
    ) {
        return this.messagesService.create(content, req.user.id, roomId);
    }



    @Get(':roomId')
    @ApiOperation({ summary: 'Get messages by room ID' })
    @ApiParam({ name: 'roomId', required: true, description: 'ID of the room' })
    async findMessageByRoom(@Param('roomId') roomId: string) {
        return this.messagesService.findMessageByRoom(roomId);
    }
}
