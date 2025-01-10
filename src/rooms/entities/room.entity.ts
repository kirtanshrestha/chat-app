import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Message } from 'src/messages/entities/message.entity';

@Entity('Rooms')
export class Room {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ default: 'Public' })
    type: string;

    @ManyToMany(() => User, (user) => user.rooms, { cascade: true })
    @JoinTable() // Join table defined here
    participants: User[];

    @OneToMany(() => Message, (message) => message.room)
    messages: Message[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
