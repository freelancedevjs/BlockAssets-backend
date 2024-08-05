import { CustomRepository } from '../common/decorators/typeorm.decorator';
import { Vote } from './entities/vote.entity';
import { ExtendedRepository } from 'src/common/graphql/customExtended';
import { VoteEntry } from './entities/vote-entry.entity';

@CustomRepository(Vote)
export class VoteRepository extends ExtendedRepository<Vote> {}

@CustomRepository(VoteEntry)
export class VoteEntryRepository extends ExtendedRepository<VoteEntry> {}
