import { expect } from 'chai';

import { RequestMock, ResponseMock, NextMock, wrapExpressMocks } from './mock/express';

import { ApiError, onError } from '../src/model/error';

describe('onError', () => {
    let consoleLogOrig: typeof console.log;

    before(() => {
        consoleLogOrig = console.log;
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        console.log = (() => {}) as unknown as typeof console.log;
    });

    after(() => {
        console.log = consoleLogOrig;
    });

    let req: RequestMock;
    let res: ResponseMock;
    let next: NextMock;

    beforeEach(() => {
        req = new RequestMock();
        res = new ResponseMock();
        next = new NextMock();
    });

    it('should send 403 on ApiError', () => {
        onError(new ApiError('test error', 'reason'), ...wrapExpressMocks(req, res, next));
        expect(res.statusCode).eq(403);
        expect(JSON.stringify(res.data)).eq(JSON.stringify({
            error: 'reason',
        }));
    });

    it('should send 500 on unexpected error', () => {
        onError(new Error('test error'), ...wrapExpressMocks(req, res, next));
        expect(res.statusCode).eq(500);
        expect(JSON.stringify(res.data)).eq(JSON.stringify({
            error: 'Unknown error',
        }));
    });
});
