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
    @Query('no-pagination') noPagination = 'false',
  ): Promise<any> {
    if (noPagination === 'true') {
      return this.rssService.parseRssFeed(url);
    }
    return this.rssService.parseRssFeedWithPagination(
      url,
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }
}
