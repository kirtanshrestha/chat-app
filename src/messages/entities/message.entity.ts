import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Room } from 'src/rooms/entities/room.entity';

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @CreateDateColumn()
    timestamp: Date;

    @ManyToOne(() => User, (user) => user.messages)
    sender: User;

    @ManyToOne(() => Room, (room) => room.messages)
    room: Room;
}