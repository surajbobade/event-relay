import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ApiKeysService } from '../api-keys.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(private readonly apiKeysService: ApiKeysService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const authHeader = req.headers['authorization'] as string | undefined;

        if (!authHeader?.startsWith('Bearer ')) {
            throw new UnauthorizedException();
        }

        const rawKey = authHeader.slice('Bearer '.length).trim();
        const businessId = await this.apiKeysService.validate(rawKey);

        if (!businessId) {
            throw new UnauthorizedException();
        }

        req.user = { bId: businessId };

        return true;
    }
}
