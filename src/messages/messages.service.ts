import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
    ) { }

    async create(content: string, senderId: number, roomId: string, type?: string): Promise<Message> {
        const message = this.messageRepository.create({ content, sender: { id: senderId }, room: { id: roomId }, type });
        return this.messageRepository.save(message);
    }

    async findMessageByRoom(roomId: string): Promise<Message[]> {
        return this.messageRepository.find({
            where: { room: { id: roomId } },
            relations: ['room', 'sender'],
            order: { timestamp: 'ASC' }
        })
    }
}