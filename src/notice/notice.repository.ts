import { CustomRepository } from '../common/decorators/typeorm.decorator';
import { Notice } from './entities/notice.entity';
import { ExtendedRepository } from 'src/common/graphql/customExtended';

@CustomRepository(Notice)
export class NoticeRepository extends ExtendedRepository<Notice> {}
