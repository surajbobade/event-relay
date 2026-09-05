import {
    ArrayNotEmpty,
    IsBoolean,
    IsOptional,
    IsString,
    IsUrl,
    Length,
} from 'class-validator';

export class UpdateWebhookDto {
    @IsOptional()
    @IsString()
    @Length(3, 50)
    name?: string;

    @IsOptional()
    @IsUrl()
    targetUrl?: string;

    @IsOptional()
    @ArrayNotEmpty()
    @IsString({ each: true })
    events?: string[];

    @IsOptional()
    @IsBoolean()
    active?: boolean;
}
