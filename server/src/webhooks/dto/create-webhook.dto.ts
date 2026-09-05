import {
    ArrayNotEmpty,
    IsBoolean,
    IsOptional,
    IsString,
    IsUrl,
    Length,
} from 'class-validator';

export class CreateWebhookDto {
    @IsString()
    @Length(3, 50)
    name!: string;

    @IsUrl()
    targetUrl!: string;

    @ArrayNotEmpty()
    @IsString({ each: true })
    events!: string[];

    @IsOptional()
    @IsBoolean()
    active?: boolean;
}
