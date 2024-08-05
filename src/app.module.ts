import { NotificationModule } from './notification/notification.module';
import { NewsModule } from './news/news.module';
import { DisclosureModule } from './disclosure/disclosure.module';
import { PropertyModule } from './property/property.module';
import { VoteModule } from './vote/vote.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { NoticeModule } from './notice/notice.module';
import { FaqModule } from './faq/faq.module';
import { PageModule } from './page/page.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';
import { getEnvPath } from './common/helper/env.helper';
import { SharedModule } from './common/shared/shared.module';
import { SettingService } from './common/shared/services/setting.service';
import { HealthModule } from './health/health.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { PortfolioModule } from './portfolio/portfolio.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.development', '.env.production'],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [SharedModule],
      inject: [SettingService],
      useFactory: (settingService: SettingService) =>
        settingService.graphqlUseFactory,
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      auth_pass: process.env.REDIS_PASSWORD || '',
      password: process.env.REDIS_PASSWORD || '',
      // ttl: Number(process.env.REDIS_TTL),
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      inject: [SettingService],
      useFactory: (settingService: SettingService) =>
        settingService.typeOrmUseFactory,
    }),
    AuthModule,
    UserModule,
    PageModule,
    FaqModule,
    SubscriptionModule,
    VoteModule,
    PropertyModule,
    DisclosureModule,
    NewsModule,
    NoticeModule,
    NotificationModule,
    UploadModule,
    HealthModule,
    PortfolioModule,
  ],
})
export class AppModule {}
