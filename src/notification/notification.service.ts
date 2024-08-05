import { Injectable } from '@nestjs/common';
import { OneRepoQuery, RepoQuery } from 'src/common/graphql/types';
import { NotificationRepository } from './notification.repository';
import { Notification } from './entities/notification.entity';
import {
  CreateNotificationInput,
  CreateNotificationInputFinal,
  UpdateNotificationInput,
} from './inputs/notification.input';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  getMany(qs: RepoQuery<Notification> = {}, gqlQuery?: string) {
    return this.notificationRepository.getMany(qs, gqlQuery);
  }

  getOne(qs: OneRepoQuery<Notification>, gqlQuery?: string) {
    return this.notificationRepository.getOne(qs, gqlQuery);
  }

  create(input: CreateNotificationInputFinal) {
    const notification = this.notificationRepository.create(input);

    return this.notificationRepository.save(notification);
  }

  update(id: string, input: UpdateNotificationInput) {
    const notification = this.notificationRepository.create(input);

    return this.notificationRepository.update(id, notification);
  }

  delete(id: string) {
    return this.notificationRepository.delete({ id });
  }
}
