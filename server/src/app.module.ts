import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EndpointsModule } from './endpoints/endpoints.module';
import { RequestsModule } from './requests/requests.module';
import { CaptureModule } from './capture/capture.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                uri: config.get<string>('MONGODB_URI'),
            }),
        }),
        AuthModule,
        UsersModule,
        EndpointsModule,
        RequestsModule,
        CaptureModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
