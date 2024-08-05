import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CreateUserInput } from '../../user/inputs/user.input';
import { UserType } from '../../user/entities/user.entity';
import { Transform, Expose } from 'class-transformer';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);

export const ExposeForAdmin = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user.role === 'admin' ? data : undefined;
  },
);

@ValidatorConstraint({
  name: 'corporateUserTypeConditionalNotEmpty',
  async: false,
})
export class CorporateUserTypeConditionalNotEmpty
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments): boolean {
    const createUserInput: CreateUserInput = args.object as CreateUserInput;

    if (createUserInput.userType === UserType.CORPORATE) {
      return !!(value && value.trim().length > 0);
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.targetName} is required for CORPORATE user_type`;
  }
}

@ValidatorConstraint({
  name: 'individualUserTypeConditionalNotEmpty',
  async: false,
})
export class IndividualUserTypeConditionalNotEmpty
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments): boolean {
    const createUserInput: CreateUserInput = args.object as CreateUserInput;

    if (createUserInput.userType === UserType.INDIVIDUAL) {
      return typeof value === 'string' ? !!value.trim() : value instanceof Date;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.targetName} is required for INDIVIDUAL user_type`;
  }
}
