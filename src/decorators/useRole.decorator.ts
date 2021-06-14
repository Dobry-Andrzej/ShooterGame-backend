import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../utils/types';

export const UseRoles = (...roles: UserRole[]) => SetMetadata('roles', roles);
