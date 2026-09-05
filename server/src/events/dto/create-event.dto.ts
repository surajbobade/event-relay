import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateEventDto {
    @IsString()
    @IsNotEmpty()
    event!: string;

    @IsOptional()
    @IsObject()
    payload?: Record<string, any>;
}
