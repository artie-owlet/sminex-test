import { NextFunction, Response } from 'express';

import { log } from '../log';

import { IApiRequest } from './api-request';

export class ApiError extends Error {
    constructor(
        message: string,
        public readonly userMessage = 'Access denied',
    ) {
        super(message);
    }
}

export function onError(err: Error, _req: IApiRequest, res: Response, _next: NextFunction): void {
    if (err instanceof ApiError) {
        log.warn(err.message);
        res.status(403)
            .send({
                error: err.userMessage,
            });
    } else {
        /* istanbul ignore next: else */
        log.error(err instanceof Error ? err.message : String(err));
        res.status(500)
            .send({
                error: 'Unknown error',
            });
    }
}
