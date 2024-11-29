import { Controller, Get, Query } from '@nestjs/common';
import { RssService } from './rss.service';

@Controller('rss')
export class RssController {
  constructor(private readonly rssService: RssService) {}

  @Get('to-json')
  async getRssAsJson(
    @Query('url') url: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ): Promise<any> {
    return this.rssService.parseRssFeedWithPagination(
      url,
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }
}
