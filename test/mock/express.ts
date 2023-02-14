import { Response, NextFunction } from 'express';

import { IApiRequest, IUserData } from '../../src/model/api-request';

export class RequestMock {
    public body?: any;
    public params?: any;
    public userData?: IUserData;
}

export class ResponseMock {
    public statusCode?: number;
    public data?: any;

    public status(code: number): ResponseMock {
        this.statusCode = code;
        return this;
    }

    public send(data: unknown): ResponseMock {
        this.data = data;
        return this;
    }
}

export class NextMock extends Function {
    public error?: any;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    private _bound = this.bind(this);

    constructor() {
        super('...args', 'return this._bound._call(...args)');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this._bound;
    }
    
    public _call(err: unknown): void {
        this.error = err;
    }
}

export function wrapExpressMocks<T = unknown>(req: RequestMock, res: ResponseMock, next: NextMock
): [IApiRequest<T>, Response, NextFunction] {
    return [
        req as unknown as IApiRequest<T>,
        res as unknown as Response,
        next as unknown as NextFunction,
    ];
}
