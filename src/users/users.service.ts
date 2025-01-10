import { Body, Injectable, NotFoundException, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';

import { RoomsService } from 'src/rooms/rooms.service';
import { MessagesService } from 'src/messages/messages.service';
import { log } from 'console';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,


        private readonly roomsService: RoomsService,
        private readonly messagesService: MessagesService,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = this.userRepository.create(createUserDto);
        return this.userRepository.save(user);
    }

    // Find a user by email
    async findByEmail(email: string): Promise<User | undefined> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user)``
        throw new NotFoundException(`No user with email ${email}`)
        return user;
    }

    async findByEmailforLogin(email: string): Promise<User | undefined> {
        const user = await this.userRepository.findOne({ where: { email } });
        return user;
    }

    // Find a user by username
    async findByUsername(username: string): Promise<User | object> {
        const user = await this.userRepository.findOne({ where: { username: username }, relations: ['rooms'] });
        if (!user)
            return {
                msg: `${username} doesnt exist`
            };
        return user;
    }

    async findByUsernameforLogin(username: string): Promise<User | undefined> {
        const user = await this.userRepository.findOne({ where: { username } });
        return user;
    }

    // Find a user by ID
    async findById(id: number): Promise<User> {
        const user = await this.userRepository.findOneBy({ id });
        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        await this.userRepository.update(id, updateUserDto);
        return this.userRepository.findOneBy({ id });
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }


    async remove(@Req() req, username: string): Promise<object> {
        const user = await this.findByUsernameforLogin(username);
        await this.userRepository.remove(user);
        return { msg: `${username} has been removed by ${req.user.username}.` };
    }

    async createPayment(@Body('amount') amount: number, @Body('receiver') receiver: string, sender: string) {

        const senderObj = await this.userRepository.findOne({ where: { username: sender } })
        const receiverObj = await this.userRepository.findOne({ where: { username: receiver } })

        const balance = senderObj.balance;

        if (amount > balance) {
            console.log('inssuficent balance');
            return `insufficient balance: ${balance}`;
        }
        else {
            receiverObj.balance = receiverObj.balance+ Number(amount);
            senderObj.balance -= amount;
            console.log(receiverObj.balance);
            console.log(senderObj.balance);
            this.userRepository.save(receiverObj);
            this.userRepository.save(senderObj);
        }

        const room = await this.roomsService.createChat(senderObj.id, receiverObj.id);
        const content = `${senderObj.name} sent ${receiverObj.name} Rs. ${amount}`;
        console.log(content);
        const message = await this.messagesService.create(content, senderObj.id, room.id, 'balance');

        return message.content;
    }
}