import {
    All,
    Body,
    Controller,
    Headers,
    HttpCode,
    Query,
    Req,
    Res,
} from '@nestjs/common';
import type { Request as ExpressRequest, Response } from 'express';

import { CaptureService } from './capture.service';

@Controller()
export class CaptureController {
    constructor(private readonly captureService: CaptureService) {}

    @All('*')
    async capture(
        @Req() req: ExpressRequest,
        @Res() res: Response,
        @Headers() headers: Record<string, string>,
        @Query() query: Record<string, unknown>,
        @Body() body: unknown,
    ) {
        const response = await this.captureService.capture({
            host: req.hostname,
            method: req.method,
            url: req.originalUrl,
            path: req.path,
            headers,
            query,
            body,
            ip: req.ip,
            userAgent: req.get('user-agent') ?? undefined,
            contentType: req.get('content-type') ?? undefined,
            contentLength: req.get('content-length')
                ? Number(req.get('content-length'))
                : undefined,
        }) as unknown as any;

        res.status(response.res?.status || 200);

        Object.entries(response.res?.headers || {}).forEach(([key, value]) => {
            res.setHeader(key, value as string);
        });

        return res.send(response.body);
    }
}
