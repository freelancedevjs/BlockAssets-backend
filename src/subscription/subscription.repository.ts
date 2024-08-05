import { CustomRepository } from '../common/decorators/typeorm.decorator';
import { Subscription } from './entities/subscription.entity';
import { ExtendedRepository } from 'src/common/graphql/customExtended';

@CustomRepository(Subscription)
export class SubscriptionRepository extends ExtendedRepository<Subscription> {}
