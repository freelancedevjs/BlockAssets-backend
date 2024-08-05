import { GraphqlPassportAuthGuard } from '../common/guards/graphql-passport-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PropertyService } from './property.service';
import { GetManyInput, GetOneInput } from 'src/common/graphql/custom.input';
import { CurrentQuery } from 'src/common/decorators/query.decorator';
import GraphQLJSON from 'graphql-type-json';
import {
  GetPropertyType,
  Property,
  PropertyStatus,
} from './entities/property.entity';
import {
  CreatePropertyInput,
  UpdatePropertyInput,
} from './inputs/property.input';
import {
  CreatePropertyAttachmentInput,
  UpdatePropertyAttachmentInput,
} from './inputs/property-attachment.input';
import { CurrentUser } from '../common/decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import { CreatePropertyNotificationInput } from './inputs/property-notification.input';
import {
  GetPropertyImageType,
  PropertyImage,
} from './entities/property-image.entity';
import {
  CreatePropertyImageInput,
  UpdatePropertyImageInput,
} from './inputs/property-image.input';
import { PropertyNotification } from './entities/property-notification.entity';
import { PropertyAttachment } from './entities/property-attachment.entity';

@Resolver()
export class PropertyResolver {
  constructor(private readonly propertyService: PropertyService) {}

  @Query(() => GetPropertyType)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  getManyPropertyList(
    @Args({ name: 'input', nullable: true })
    qs: GetManyInput<Property>,
    @CurrentQuery() gqlQuery: string,
  ) {
    return this.propertyService.getMany(qs, gqlQuery);
  }

  @Query(() => Property)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  getOneProperty(
    @Args({ name: 'input' })
    qs: GetOneInput<Property>,
    @CurrentQuery() gqlQuery: string,
  ) {
    return this.propertyService.getOne(qs, gqlQuery);
  }

  @Query(() => GetPropertyType)
  getProperties(
    @Args({ name: 'input', nullable: true })
    qs: GetManyInput<Property>,
    @CurrentQuery() gqlQuery: string,
  ) {
    return this.propertyService.getMany(
      {
        ...(qs || {}),
        where: { ...(qs?.where || {}), status: PropertyStatus.PUBLISHED },
      },
      gqlQuery,
    );
  }

  @Query(() => Property)
  getProperty(
    @Args({ name: 'input' })
    slug: string,
    @CurrentQuery() gqlQuery: string,
  ) {
    return this.propertyService.getOne(
      { where: { slug: slug, status: PropertyStatus.PUBLISHED } },
      gqlQuery,
    );
  }

  @Mutation(() => Property)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  createProperty(@Args('input') input: CreatePropertyInput) {
    return this.propertyService.create(input);
  }

  @Mutation(() => GraphQLJSON)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  updateProperty(
    @Args('id') id: string,
    @Args('input') input: UpdatePropertyInput,
  ) {
    return this.propertyService.update(id, input);
  }

  @Mutation(() => GraphQLJSON)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  deleteProperty(@Args('id') id: string) {
    return this.propertyService.delete(id);
  }

  @Mutation(() => PropertyAttachment)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  createPropertyAttachment(
    @Args('input') input: CreatePropertyAttachmentInput,
  ) {
    return this.propertyService.createAttachment(input);
  }

  @Mutation(() => GraphQLJSON)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  updatePropertyAttachment(
    @Args('id') id: string,
    @Args('input') input: UpdatePropertyAttachmentInput,
  ) {
    return this.propertyService.updateAttachment(id, input);
  }

  @Mutation(() => GraphQLJSON)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  deletePropertyAttachment(@Args('id') id: string) {
    return this.propertyService.deleteAttachment(id);
  }

  @Mutation(() => PropertyNotification)
  @UseGuards(new GraphqlPassportAuthGuard('user'))
  createPropertyNotification(
    @Args('input') input: CreatePropertyNotificationInput,
    @CurrentUser() user: User,
  ) {
    return this.propertyService.createNotification(input, user);
  }

  @Mutation(() => GraphQLJSON)
  @UseGuards(new GraphqlPassportAuthGuard('user'))
  deletePropertyNotification(
    @Args('input') input: string,
    @CurrentUser() user: User,
  ) {
    return this.propertyService.deleteNotification(input, user);
  }

  @Query(() => GetPropertyImageType)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  getManyPropertyImageList(
    @Args({ name: 'input', nullable: true })
    qs: GetManyInput<PropertyImage>,
    @CurrentQuery() gqlQuery: string,
  ) {
    return this.propertyService.getManyImage(qs, gqlQuery);
  }

  @Query(() => PropertyImage)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  getOneImage(
    @Args({ name: 'input' })
    qs: GetOneInput<PropertyImage>,
    @CurrentQuery() gqlQuery: string,
  ) {
    return this.propertyService.getOneImage(qs, gqlQuery);
  }

  @Query(() => GetPropertyType)
  getPropertyImages(
    @Args({ name: 'input', nullable: true })
    qs: GetManyInput<PropertyImage>,
    @CurrentQuery() gqlQuery: string,
  ) {
    return this.propertyService.getManyImage(
      {
        ...(qs || {}),
        where: { ...(qs?.where || {}) },
      },
      gqlQuery,
    );
  }

  @Query(() => PropertyImage)
  getPropertyImage(
    @Args({ name: 'input' })
    qs: GetOneInput<PropertyImage>,
    @CurrentQuery() gqlQuery: string,
  ) {
    return this.propertyService.getOneImage(qs, gqlQuery);
  }

  @Mutation(() => PropertyImage)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  createPropertyImage(@Args('input') input: CreatePropertyImageInput) {
    return this.propertyService.createImage(input);
  }

  @Mutation(() => GraphQLJSON)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  updatePropertyImage(
    @Args('id') id: string,
    @Args('input') input: UpdatePropertyImageInput,
  ) {
    return this.propertyService.updateImage(id, input);
  }

  @Mutation(() => GraphQLJSON)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  deletePropertyImage(@Args('id') id: string) {
    return this.propertyService.deleteImage(id);
  }
}
