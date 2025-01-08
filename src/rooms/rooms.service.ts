import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Message } from 'src/messages/entities/message.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { partition } from 'rxjs';

@Injectable()
export class RoomsService {

    constructor(
        @InjectRepository(Room)
        private readonly roomsRepository: Repository<Room>,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(Message)
        private readonly messagesRepository: Repository<Message>,
    ) { }

    async createRoom(createRoomDto: CreateRoomDto): Promise<Room> {
        const { name, type, participants } = createRoomDto;
        const users = await this.usersRepository.find();
        const room = this.roomsRepository.create({
            name,
            type,
            participants: users,
        });
        return this.roomsRepository.save(room);
    }

    async findRoomByName(roomName: string): Promise<Room> {
        return this.roomsRepository.findOne({
            where: { name: roomName },
            relations: ['participants', 'messages'],
        });

    }
    async findRoomByUserid(userid: number): Promise<Room[]> {
        const roomquery: Room[] = await this.roomsRepository.find({
            relations: ['participants'],
        });
        let rooms = [];
        roomquery.forEach(room => {
            room.participants.forEach(user => {
                if (user.id == userid) {
                    const temp = { id: room.id, name: room.name };
                    rooms.push(temp);
                }
            });
            console.log(rooms);
        });
        return rooms;
    }

    async findRoomById(roomId: string): Promise<Room> {
        const room = await this.roomsRepository.findOne({
            where: { id: roomId },
            relations: ['participants']
        })

        if (!room)
            throw new NotFoundException(`No room with id ${roomId}`);
        return room;
    }

    async findAll(): Promise<Room[]> {
        return this.roomsRepository.find();
    }

    async joinRoom(userId: number, roomId: string) {
        var room = await this.findRoomById(roomId);
        var user = await this.usersRepository.findOne({ where: { id: userId } });
        if (room.participants.includes(user))
            throw new ConflictException(`${userId} is already inside room: ${roomId}`);
        room.participants.push(user);
        return this.roomsRepository.save(room);
    }
}
