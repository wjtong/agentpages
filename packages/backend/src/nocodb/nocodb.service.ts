import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NocodbService {
  private readonly logger = new Logger(NocodbService.name);
  private readonly baseUrl:
  private readonly baseId:
  private readonly authToken:

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.baseUrl = this.configService.get<string>('NOCODB_BASE_URL');
    this.baseId = this.configService.get<string>('NOCODB_BASE_ID');
    this.authToken = this.configService.get<string>('NOCODB_AUTH_TOKEN');

    if (!this.baseUrl || !this.baseId || !this.authToken) {
        throw new Error('NocoDB environment variables are not fully configured.');
    }
  }

  /**
   * Fetches records from a specific table in NocoDB.
   * @param tableName The name of the table to fetch records from.
   * @returns A promise that resolves to an array of records.
   */
  async getTable(tableName: string): Promise<any[]> {
    this.logger.log(`Fetching data for table: ${tableName}`);
    
    const url = `${this.baseUrl}/api/v2/db/data/v1/${this.baseId}/${tableName}`;
    
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: { 'xc-token': this.authToken },
        }),
      );
      // The actual data is in response.data.list based on NocoDB v2 API
      return response.data.list;
    } catch (error) {
      this.logger.error(
        `Failed to fetch data from NocoDB for table ${tableName}: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to fetch data from NocoDB',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
