import { Controller, Get, Param } from '@nestjs/common';
import { NocodbService } from '../nocodb/nocodb.service';

@Controller('api/proxy/master-data')
export class MasterDataController {
  constructor(private readonly nocodbService: NocodbService) {}

  @Get(':tableName')
  async getTableData(@Param('tableName') tableName: string) {
    return this.nocodbService.getTable(tableName);
  }
}
