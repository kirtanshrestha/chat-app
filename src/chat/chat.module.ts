import { forwardRef, Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessagesModule } from 'src/messages/messages.module';
import { UsersModule } from 'src/users/users.module';
import { RoomsModule } from 'src/rooms/rooms.module';

@Module({
  imports: [forwardRef(() => MessagesModule), UsersModule, RoomsModule],
  providers: [ChatGateway],
})
export class ChatModule { }
