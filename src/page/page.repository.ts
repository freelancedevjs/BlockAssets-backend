import { CustomRepository } from '../common/decorators/typeorm.decorator';
import { Page } from './entities/page.entity';
import { ExtendedRepository } from 'src/common/graphql/customExtended';

@CustomRepository(Page)
export class PageRepository extends ExtendedRepository<Page> {}
