import { NextFunction, Request, Response } from 'express';

import { log } from '../log';

export class ApiError extends Error {
    constructor(
        message: string,
        public readonly userMessage = 'Access denied',
    ) {
        super(message);
    }
}

export function onError(err: Error, _req: Request, res: Response, _next: NextFunction): void {
    if (err instanceof ApiError) {
        log.warn(err.message);
        res.status(403)
            .send({
                error: err.userMessage,
            });
    } else {
        log.error(err instanceof Error ? err.message : String(err));
        res.status(500)
            .send({
                error: 'Unknown error',
            });
    }
}
