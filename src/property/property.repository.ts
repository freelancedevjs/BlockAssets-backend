import { CustomRepository } from '../common/decorators/typeorm.decorator';
import { Property } from './entities/property.entity';
import { ExtendedRepository } from 'src/common/graphql/customExtended';
import { PropertyAttachment } from './entities/property-attachment.entity';
import { PropertyNotification } from './entities/property-notification.entity';
import { PropertyImage } from './entities/property-image.entity';

@CustomRepository(Property)
export class PropertyRepository extends ExtendedRepository<Property> {}

@CustomRepository(PropertyAttachment)
export class PropertyAttachmentRepository extends ExtendedRepository<PropertyAttachment> {}

@CustomRepository(PropertyImage)
export class PropertyImageRepository extends ExtendedRepository<PropertyImage> {}

@CustomRepository(PropertyNotification)
export class PropertyNotificationRepository extends ExtendedRepository<PropertyNotification> {}
