import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NocodbModule } from './nocodb/nocodb.module';
import { MasterDataController } from './master-data/master-data.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), NocodbModule],
  controllers: [AppController, MasterDataController],
  providers: [AppService],
})
export class AppModule {}
