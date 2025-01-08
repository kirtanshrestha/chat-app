import { IsString, IsOptional } from 'class-validator';

export class CreateRoomDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    type: string;

    participants: string[]; // List of user IDs for participants
}
