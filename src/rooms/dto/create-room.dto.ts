import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateRoomDto {
    @IsString()
    @ApiProperty({
        description: 'Name of the room',
        example: 'General'
    })
    name: string;

    @IsString()
    @IsOptional()
    type: string;

    participants: string[]; // List of user IDs for participants
}
