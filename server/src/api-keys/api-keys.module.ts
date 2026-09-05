import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiKey, ApiKeySchema } from './schemas/api-key.schema';
import { ApiKeysController } from './api-keys.controller';
import { ApiKeysService } from './api-keys.service';
import { ApiKeyGuard } from './guards/api-key.guard';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: ApiKey.name,
                schema: ApiKeySchema,
            },
        ]),
    ],
    controllers: [ApiKeysController],
    providers: [ApiKeysService, ApiKeyGuard],
    exports: [ApiKeysService, ApiKeyGuard],
})
export class ApiKeysModule {}
