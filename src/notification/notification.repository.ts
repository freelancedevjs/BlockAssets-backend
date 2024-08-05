import { CustomRepository } from '../common/decorators/typeorm.decorator';
import { Notification } from './entities/notification.entity';
import { ExtendedRepository } from 'src/common/graphql/customExtended';

@CustomRepository(Notification)
export class NotificationRepository extends ExtendedRepository<Notification> {}
