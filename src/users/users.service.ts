import { Injectable, NotFoundException, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
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
    async findById(id: number): Promise<User | undefined> {
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
}