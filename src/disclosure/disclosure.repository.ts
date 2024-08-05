import { CustomRepository } from '../common/decorators/typeorm.decorator';
import { Disclosure } from './entities/disclosure.entity';
import { ExtendedRepository } from 'src/common/graphql/customExtended';

@CustomRepository(Disclosure)
export class DisclosureRepository extends ExtendedRepository<Disclosure> {}
