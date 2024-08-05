import { Injectable } from '@nestjs/common';
import {
  NestJsNotificationChannel,
  NestJsNotification,
} from 'nestjs-notifications';
import { NotificationService } from '../notification.service';

@Injectable()
export class DatabaseChannel implements NestJsNotificationChannel {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * Send the given notification
   * @param notification
   */
  public async send(notification: NestJsNotification): Promise<void> {
    const data = this.getData(notification);
    // await this.notificationService.create({
    //   title: data.title,
    //   content: data.title,
    // });
  }

  /**
   * Get the data for the notification.
   * @param notification
   */
  getData(notification: NestJsNotification) {
    return notification.toPayload();
  }
}
