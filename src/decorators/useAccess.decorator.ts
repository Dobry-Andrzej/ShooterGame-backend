import { SetMetadata } from '@nestjs/common';
import { Permission } from '../../utils/types';

export const UseAccess = (access: Permission) => SetMetadata('access', access);
