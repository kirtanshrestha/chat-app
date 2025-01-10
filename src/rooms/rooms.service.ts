import { ConflictException, forwardRef, Inject, Injectable, NotFoundException, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RoomsService {

    constructor(
        @InjectRepository(Room)
        private readonly roomsRepository: Repository<Room>,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
    ) { }

    async createRoom(@Req() Req, createRoomDto: CreateRoomDto): Promise<Room> {
        const { name, type } = createRoomDto;
        const user = await this.usersRepository.find({ where: { id: Req.user.id } });
        const room = this.roomsRepository.create({
            name,
            type,
            participants: user,
        });
        return this.roomsRepository.save(room);
    }

    async createChat(senderId: number, receiverId: number): Promise<Room> {
        if (senderId === receiverId) {
            throw new Error("Cannot create a room with yourself.");
        }
        const roomquery: Room[] = await this.roomsRepository.find({
            relations: ['participants'],
        });
        let returnRoom = null;
        roomquery.forEach(room => {
            if (room.participants.length == 2) {
                const currentIds = room.participants.map(user => user.id);
                if (currentIds.includes(senderId) && currentIds.includes(receiverId)) {
                    returnRoom = room;
                    return;
                }
            }
        });

        if (returnRoom)
            return returnRoom;

        const newRoom = new Room();
        newRoom.name = `${senderId}&${receiverId}`;
        newRoom.type = 'Private';
        let users = [];
        users.push(await this.usersService.findById(senderId));
        users.push(await this.usersService.findById(receiverId));
        newRoom.participants = users;

        return await this.roomsRepository.save(newRoom);
    }

    async findRoomByName(roomName: string): Promise<Room> {
        return await this.roomsRepository.findOne({
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
        return await this.roomsRepository.find();
    }

    async joinRoom(userId: number, roomId: string) {
        var room = await this.findRoomById(roomId);
        var user = await this.usersRepository.findOne({ where: { id: userId } });
        if (room.participants.includes(user))
            throw new ConflictException(`${userId} is already inside room: ${roomId}`);
        room.participants.push(user);
        return this.roomsRepository.save(room);
    }

    async leaveRoom(userId: number, roomId: string) {

        var room = await this.findRoomById(roomId);
        const roomname = room.name;
        if (room.participants.length == 2) {
            const user = await this.usersRepository.findOne({ where: { id: userId } });
            const username = user.name;
            if (roomname.includes(username))
                throw new ConflictException(`cannot leave private chats.`);
        }
        room.participants = room.participants.filter(participant => participant.id !== userId);
        return this.roomsRepository.save(room);
    }
}
