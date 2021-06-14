import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../auth/user.schema';

export const UserObj = createParamDecorator(
  (data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
