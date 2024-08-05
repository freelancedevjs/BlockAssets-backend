import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { PropertyIdInput } from '../../property/inputs/property.input';
import { UserIdInput } from '../../user/inputs/user.input';
import {
  NotificationCategory,
  NotificationMode,
} from '../entities/notification.entity';

@InputType()
export class CreateNotificationInput {
  @Field(() => String)
  @IsNotEmpty()
  title: string;

  @Field(() => String)
  @IsNotEmpty()
  content: string;

  @Field(() => NotificationCategory)
  @IsNotEmpty()
  category: NotificationCategory;

  @Field(() => NotificationMode)
  @IsNotEmpty()
  mode: NotificationMode;

  @Field(() => [PropertyIdInput], { nullable: true })
  @IsOptional()
  properties?: PropertyIdInput[];

  @Field(() => [UserIdInput], { nullable: true })
  @IsOptional()
  users?: UserIdInput[];
}

@InputType()
export class CreateNotificationInputFinal {
  @Field(() => String)
  @IsNotEmpty()
  title: string;

  @Field(() => String)
  @IsNotEmpty()
  content: string;

  @Field(() => NotificationCategory)
  @IsNotEmpty()
  category: NotificationCategory;

  @Field(() => NotificationMode)
  @IsNotEmpty()
  mode: NotificationMode;

  @Field(() => PropertyIdInput, { nullable: true })
  @IsOptional()
  property?: PropertyIdInput;

  @Field(() => UserIdInput, { nullable: true })
  @IsOptional()
  user?: UserIdInput;
}

@InputType()
export class UpdateNotificationInput {
  @Field(() => String)
  @IsOptional()
  title: string;
}
