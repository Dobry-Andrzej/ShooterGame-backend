import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission, UserRole } from '../utils/types';

@Injectable()
export class HasAccessGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const access = this.reflector.get<Permission>(
      'access',
      context.getHandler(),
    );
    if (!access) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException();
    }
    if (user.role === UserRole.Admin) return true;
    if (user.role === UserRole.User) return false;
    if (user.role === UserRole.Moderator && !user.permissions) return false;

    const rightAccesses = user.permissions.map((a) => Permission[a.value]);
    return rightAccesses.includes(Permission[access]);
  }
}
