import { Module } from '@nestjs/common';
import { RssService } from './rss/rss.service';
import { RssController } from './rss/rss.controller';
import { CacheModule } from '@nestjs/cache-manager';
import Parser from 'rss-parser';

@Module({
  imports: [
    CacheModule.register({
      ttl: 300, // seconds
      max: 100, // maximum number of items in cache
    }),
  ], // Import CacheModule here
  providers: [
    RssService,
    {
      provide: 'RSS_PARSER',
      useValue: new Parser(),
    },
  ],
  controllers: [RssController],
})
export class RssModule {}
