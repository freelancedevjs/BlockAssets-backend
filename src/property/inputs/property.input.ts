import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  GrossFloorArea,
  GrossLandArea,
  PropertyBasicInformation,
  PropertyStatus,
  PropertySubscriptionInformation,
} from '../entities/property.entity';

@InputType()
export class GrossFloorAreaInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  case: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  total: string;
}

@InputType()
export class GrossLandAreaInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  case: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  total: string;
}

@InputType()
export class PropertyBasicInformationInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  address: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  zoning: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  floor: string;

  @Field(() => String)
  @IsDate()
  @IsNotEmpty()
  completion_date: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  government_land_value: string;

  @Field(() => GrossFloorAreaInput)
  @IsNotEmpty()
  gross_floor_area: GrossFloorAreaInput;

  @Field(() => GrossLandAreaInput)
  @IsNotEmpty()
  land_area: GrossLandAreaInput;
}

@InputType()
export class PropertySubscriptionInformationInput {
  @Field(() => Number)
  @IsNumber()
  @IsNotEmpty()
  total_cap: number;

  @Field(() => Number)
  @IsNumber()
  @IsNotEmpty()
  apr: number;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  frequency: string;

  @Field(() => String)
  @IsDate()
  @IsNotEmpty()
  allocation_date: string;

  @Field(() => String)
  @IsDate()
  @IsNotEmpty()
  listing_date: string;
}

@InputType()
export class CreatePropertyInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => String)
  @IsNotEmpty()
  content: string;

  @Field(() => PropertyStatus)
  @IsNotEmpty()
  status: PropertyStatus;

  @Field(() => PropertyBasicInformationInput)
  @IsNotEmpty()
  basic_info: PropertyBasicInformationInput;

  @Field(() => PropertySubscriptionInformationInput)
  @IsNotEmpty()
  subscription_info: PropertySubscriptionInformationInput;

  @Field(() => Date)
  @IsNotEmpty()
  startsAt: Date;

  @Field(() => Date)
  @IsNotEmpty()
  endsAt: Date;
}

@InputType()
export class UpdatePropertyInput {
  @Field(() => String)
  @IsOptional()
  name?: string;

  @Field(() => String)
  @IsOptional()
  content?: string;

  @Field(() => PropertyStatus)
  @IsOptional()
  status?: PropertyStatus;

  @Field(() => PropertyBasicInformationInput)
  @IsOptional()
  basic_info?: PropertyBasicInformationInput;

  @Field(() => PropertySubscriptionInformationInput)
  @IsOptional()
  subscription_info?: PropertySubscriptionInformationInput;

  @Field(() => Date)
  @IsOptional()
  startsAt?: Date;

  @Field(() => Date)
  @IsOptional()
  endsAt?: Date;
}

@InputType()
export class PropertyIdInput {
  @Field(() => String)
  @IsNotEmpty()
  id: string;
}
