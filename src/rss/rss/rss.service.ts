import {
  Injectable,
  Inject,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import Parser from 'rss-parser';

@Injectable()
export class RssService {
  private readonly logger = new Logger(RssService.name);
  private parser: Parser;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.parser = new Parser();
  }

  transformFeed(feed) {
    return {
      title: feed.title,
      description: feed.description,
      link: feed.link,
      items: feed.items.map((item) => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        content: item['content:encoded'],
        description: item['content:encodedSnippet'],
        guid: item.guid,
        categories: item.categories,
        author: item.creator,
      })),
    };
  }

  async parseRssFeed(url: string): Promise<any> {
    try {
      const cachedFeed = await this.cacheManager.get(url);
      if (cachedFeed) {
        this.logger.log(`Fetching feed from cache for URL: ${url}`);
        return this.transformFeed(cachedFeed);
      }
      this.logger.log(`Fetching feed from source for URL: ${url}`);
      const feed = await this.parser.parseURL(url);
      const transformed = this.transformFeed(feed);
      await this.cacheManager.set(url, transformed, 300);
      return transformed;
    } catch (error) {
      this.logger.error(
        `Failed to parse RSS feed for URL: ${url}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to parse RSS feed.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async parseRssFeedWithPagination(
    url: string,
    page: number,
    limit: number,
  ): Promise<any> {
    const feed = await this.parseRssFeed(url);
    const copyFeed = { ...feed };

    const pageNumber = page > 0 ? page : 1;
    const limitNumber = limit > 0 ? limit : 10;
    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = startIndex + limitNumber;

    const paginatedItems = feed.items.slice(startIndex, endIndex);

    delete copyFeed.items;

    return {
      feed: {
        ...copyFeed,
      },
      items: paginatedItems,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(feed.items.length / limitNumber),
      },
      status: HttpStatus.OK,
    };
  }
}
