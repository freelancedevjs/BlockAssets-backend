import { ApolloDriverConfig } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import GraphQLJSON from 'graphql-type-json';
import { isNil } from 'lodash';
import { join } from 'path';
import { formatError } from 'src/common/format/graphql-error.format';
import { CacheModuleOptions } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Injectable()
export class SettingService {
  constructor(private readonly configService: ConfigService) {}

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set');
    }

    return value;
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replace(/\\n/g, '\n');
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV');
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get graphqlUseFactory():
    | Omit<ApolloDriverConfig, 'driver'>
    | (Promise<Omit<ApolloDriverConfig, 'driver'>> & { uploads: boolean }) {
    const productionPath = process.env.GRAPHQL_SCHEMA_PATH;
    return {
      uploads: false,
      resolvers: { JSON: GraphQLJSON },
      autoSchemaFile: productionPath
        ? productionPath
        : this.isProduction
        ? join(process.cwd(), 'graphql-schema.gql')
        : join(process.cwd(), 'src/graphql-schema.gql'),
      sortSchema: true,
      playground: false,
      ...(!this.isProduction && {
        plugins: [
          ApolloServerPluginLandingPageLocalDefault({
            includeCookies: true,
          }),
        ],
      }),
      context: ({ req, res }) => ({ req, res }),
      cache: 'bounded',
      formatError,
    };
  }

  get typeOrmUseFactory():
    | TypeOrmModuleOptions
    | Promise<TypeOrmModuleOptions> {
    const productionPath = process.env.ENTITY_PATH;

    return {
      type: 'postgres' as any,
      host: this.getString('DB_HOST'),
      port: this.getNumber('DB_PORT'),
      username: this.getString('DB_USER'),
      password: this.getString('DB_PASSWORD'),
      database: this.getString('DB_NAME'),
      entities: [
        productionPath
          ? productionPath
          : this.isProduction
          ? '**/*.entity{.ts,.js}'
          : 'dist/**/*.entity{.ts,.js}',
      ],
      synchronize: true,
      autoLoadEntities: true,
      logging: false, // if you want to see the query log, change it to true
      // timezone: '+09:00', // if you want to use timezone, change it to your timezone
    };
  }

  get cacheUseFactory(): CacheModuleOptions {
    return {
      isGlobal: true,
      store: redisStore,
      host: this.getString('REDIS_HOST'),
      port: this.getNumber('REDIS_PORT'),
      ttl: this.getNumber('REDIS_TTL'),
    };
  }
}
