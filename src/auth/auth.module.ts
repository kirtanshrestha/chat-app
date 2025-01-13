import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from './jwt-auth.guard';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    EmailModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule, // Import UsersModule to interact with users
    JwtModule.register({
      secret: process.env.JWT_SECRET, // The secret key for JWT
      signOptions: { expiresIn: '1h' }, // Set JWT expiration time
    }),
    UsersModule,
    TypeOrmModule.forFeature([User])
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  // exports: [JwtAuthGuard]
})
export class AuthModule { }