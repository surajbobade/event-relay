import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/schemas/user.schema';
import { PERMISSION_KEY } from '../decorators/require-permission.decorator';

// Must run after JwtAuthGuard — relies on req.user already being
// populated with the full User document (role + p).
@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredPermission = this.reflector.get<string | undefined>(
            PERMISSION_KEY,
            context.getHandler(),
        );

        if (!requiredPermission) {
            return true;
        }

        const user = context.switchToHttp().getRequest().user;

        if (!user) {
            return false;
        }

        // Admins always have full access, regardless of their p array.
        if (user.role === UserRole.Admin) {
            return true;
        }

        if (user.p?.includes(requiredPermission)) {
            return true;
        }

        throw new ForbiddenException(
            'You do not have permission to perform this action.',
        );
    }
}
