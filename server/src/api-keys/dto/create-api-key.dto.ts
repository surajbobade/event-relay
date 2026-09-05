import { IsOptional, IsString, Length } from 'class-validator';

export class CreateApiKeyDto {
    @IsOptional()
    @IsString()
    @Length(1, 50)
    name?: string;
}
