import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface'; // We'll create this interface
import { UsersService } from '../users/users.service'; // Access user data
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity'; // Your user entity

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly usersService: UsersService, // Service to fetch user data
        @InjectRepository(User)
        private readonly userRepository: Repository<User>, // Inject the user repository
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from Authorization header
            secretOrKey: process.env.JWT_SECRET, // This secret should match the one used to sign the JWT
        });
    }

    async validate(payload: JwtPayload) {
        // Validate if the user exists based on the JWT payload (which contains the user id)
        const user = await this.userRepository.findOneBy({ id: payload.id });
        if (!user) {
            throw new Error('Unauthorized');
        }
        return user; // Return the user object to be attached to the request
    }
}
