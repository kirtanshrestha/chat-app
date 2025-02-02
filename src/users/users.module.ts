import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RoomsModule } from 'src/rooms/rooms.module';
import { MessagesModule } from 'src/messages/messages.module';
import { PaymentModule } from 'src/payment/payment.module';
import { AuthModule } from 'src/auth/auth.module';
import { Room } from 'src/rooms/entities/room.entity';
import { Message } from 'src/messages/entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,Room,Message]), forwardRef(() => AuthModule),
  forwardRef(() => RoomsModule), MessagesModule, PaymentModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule { }
