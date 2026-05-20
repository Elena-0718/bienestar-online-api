import { Roles } from 'src/enum/roles.enum';
import { SetMetadata } from '@nestjs/common';

export const RolesDecorator = (...roles: Roles[]) => SetMetadata('roles', roles);
