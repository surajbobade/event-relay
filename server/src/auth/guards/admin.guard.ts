import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { UserRole } from '../../users/schemas/user.schema';

// Must run after JwtAuthGuard — relies on req.user already being
// populated with the full User document (role).
@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const user = context.switchToHttp().getRequest().user;

        if (user?.role !== UserRole.Admin) {
            throw new ForbiddenException('Only admins can perform this action.');
        }

        return true;
    }
}
