import { CustomRepository } from '../common/decorators/typeorm.decorator';
import { News } from './entities/news.entity';
import { ExtendedRepository } from 'src/common/graphql/customExtended';

@CustomRepository(News)
export class NewsRepository extends ExtendedRepository<News> {}
