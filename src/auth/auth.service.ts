import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async register(createUserDto: CreateUserDto): Promise<User> {
        const { email, password, name, username } = createUserDto;

        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const existingUsername = await this.usersService.findByUsernameforLogin(username);
        if (existingUsername) {
            throw new ConflictException('Username is already taken');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User();
        newUser.email = email;
        newUser.password = hashedPassword;
        newUser.name = name;
        newUser.username = username;

        return this.usersService.create(newUser);
    }

    async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
        const { email, password } = loginDto;

        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const payload: JwtPayload = { id: user.id, email: user.email, username: user.username };
        const accessToken = this.jwtService.sign(payload);


        return { accessToken };
    }

    // Validate user from the JWT payload
    async validateUser(userId: number): Promise<User> {
        const user = await this.usersService.findById(userId);
        return user || null;
    }

    // Validate user credentials during login
    async validateUserCredentials(email: string, password: string): Promise<User | null> {
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        return null;
    }
}
