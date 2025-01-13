import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import * as jwt from 'jsonwebtoken';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly emailService: EmailService
    ) { }

    async register(createUserDto: CreateUserDto): Promise<User> {
        const { email, password, name, username } = createUserDto;

        const existingUser = await this.usersService.findByEmailforLogin(email);
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

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        await this.emailService.sendVerificationEmail(email, token);

        return this.usersService.create(newUser);
    }

    async login(loginDto: LoginDto): Promise<{ accessToken?: string, message?: string }> {
        const { email, password } = loginDto;

        const user = await this.usersService.findByEmailforLogin(email);
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        if (!user.isEmailVerified) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            await this.emailService.sendVerificationEmail(email, token);

            return { message: 'Email hasnt been verified yet please check you email for a verification link..' }
        }
        const payload: JwtPayload = { id: user.id, email: user.email, username: user.username };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
    }


    generateEmailVerificationToken(userId: number, email: string): string {
        const payload = { userId, email };
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30m' });
    }

    async verifyEmail(token: string): Promise<string> {
        let decode: any;
        try {
            decode = jwt.verify(token, process.env.JWT_SECRET);
        }
        catch (error) {
            throw new Error('invalid or expired token');
        }

        const user = await this.usersService.findByEmailforLogin(decode.email);

        if (user.isEmailVerified)
            return 'Email already verified. Please login'

        user.isEmailVerified = true;

        await this.usersService.update(user.id, { isEmailVerified: user.isEmailVerified });

        return 'Email has now been verified. proceed to login';
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
