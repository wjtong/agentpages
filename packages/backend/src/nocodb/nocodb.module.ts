import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NocodbService } from './nocodb.service';

@Module({
  imports: [HttpModule],
  providers: [NocodbService],
  exports: [NocodbService],
})
export class NocodbModule {}
