import { IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreateEndpointDto {
    @IsString()
    @Length(3, 50)
    name!: string;

    @IsString()
    @Length(3, 50)
    @Matches(/^[a-z0-9-]+$/, {
        message:
            'Subdomain can only contain lowercase letters, numbers and hyphens.',
    })
    domain!: string;

    @IsOptional()
    @IsString()
    @Length(0, 200)
    description?: string;
}
