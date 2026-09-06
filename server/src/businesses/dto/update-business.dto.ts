import { IsString, Length } from 'class-validator';

export class UpdateBusinessDto {
    @IsString()
    @Length(2, 100)
    name!: string;
}
