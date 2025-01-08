import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from '../messages/messages.service';
import { UsersService } from 'src/users/users.service';
import { RoomsService } from 'src/rooms/rooms.service';
import * as jwt from 'jsonwebtoken';

@WebSocketGateway({ cors: true })  // Enable CORS
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly messagesService: MessagesService,
    private readonly usersService: UsersService,
    private readonly roomsService: RoomsService
  ) { }

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }
  private connectedUsers: Map<string, string> = new Map();
  // Handle a new WebSocket connection
  handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const decodedPayload = payload as jwt.JwtPayload;
      const senderId = decodedPayload.id;
      this.connectedUsers.set(client.id, senderId);

      console.log(`Client connected: ${client.id} Username: ${decodedPayload.username} Id: ${decodedPayload.id}`);
      console.log('Connected clients:', this.server.engine.clientsCount);
      this.usersService.update(senderId, { isActive: true })
    }
    catch (error) {
      console.error('Invalid token:', error.message);
      client.disconnect(); // Disconnect the client if the token is inva
    }

  }

  // Handle WebSocket disconnection
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.usersService.update(parseInt(this.connectedUsers.get(client.id)), { isActive: false })

  }

  // Handle "sendMessage" event to store the message and broadcast it to all connected clients
  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, payload: { content: string; senderId?: number; roomId: string }) {

    const id = this.connectedUsers.get(client.id);
    const senderId = parseInt(id, 10);

    // Save the message to the database using the MessagesService
    const newMessage = await this.messagesService.create(payload.content, senderId, payload.roomId);

    // Emit the new message to all clients in the same room
    this.server.to(payload.roomId).emit('newMessage', newMessage);
  }

  // Handle "joinRoom" event to join a client to a specific room
  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, roomId: string) {
    client.join(roomId);
    client.emit('joinedRoom', roomId);
  }

  // Handle "leaveRoom" event to disconnect the client from a specific room
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, roomId: string) {
    client.leave(roomId);
    client.emit('leftRoom', roomId);
  }
}
