import { CustomRepository } from '../common/decorators/typeorm.decorator';
import { Faq } from './entities/faq.entity';
import { ExtendedRepository } from 'src/common/graphql/customExtended';

@CustomRepository(Faq)
export class FaqRepository extends ExtendedRepository<Faq> {}
