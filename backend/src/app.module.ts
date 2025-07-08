import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { NftController } from './controllers/nft.controller';
import { NftService } from './services/nft.service';
import { SolanaService } from './services/solana.service';
import { AiService } from './services/ai.service';
import { StorageService } from './services/storage.service';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { FusionController } from './controllers/fusion.controller';
import { FusionService } from './services/fusion.service';

import { User } from './entities/user.entity';
import { Nft } from './entities/nft.entity';
import { Fusion } from './entities/fusion.entity';
import { Collection } from './entities/collection.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'nft_fusion_db',
      entities: [User, Nft, Fusion, Collection],
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
    }),
    TypeOrmModule.forFeature([User, Nft, Fusion, Collection]),
    ScheduleModule.forRoot(),
  ],
  controllers: [
    AppController,
    NftController,
    AuthController,
    UserController,
    FusionController,
  ],
  providers: [
    AppService,
    NftService,
    SolanaService,
    AiService,
    StorageService,
    AuthService,
    UserService,
    FusionService,
  ],
})
export class AppModule {} 