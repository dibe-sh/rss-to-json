import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RssModule } from './rss/rss.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      ttl: 300, // Cache time-to-live in seconds
      max: 100, // Maximum number of items in cache
      isGlobal: true, // Make this cache available across the entire application
    }),
    RssModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
