import { expect } from 'chai';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pg = require('pg') as typeof import('pg');

import { describeMethod } from './mocha-format';
import { uploadCsv, uploadCsvErr, uploadSql } from './data/upload';
import { PoolMock, UploadClientMock } from './mock/pg';
import { RequestMock, ResponseMock, NextMock, wrapExpressMocks } from './mock/express';

import { Admin, ISetUserParams } from '../src/model/admin';
import { ApiError } from '../src/model/error';
import { AdminDatabase } from '../src/service/admin-database';

describe('Admin', () => {
    let pgPoolOrig: typeof pg.Pool;

    before(() => {
        pgPoolOrig = pg.Pool;
        pg.Pool = PoolMock as unknown as typeof pg.Pool;
    });

    after(() => {
        pg.Pool = pgPoolOrig;
    });

    let admin: Admin;
    let req: RequestMock;
    let res: ResponseMock;
    let next: NextMock;

    beforeEach(() => {
        admin = new Admin(new AdminDatabase({}));
        req = new RequestMock();
        res = new ResponseMock();
        next = new NextMock();
    });

    afterEach(() => {
        PoolMock.clear();
        UploadClientMock.clear();
    });

    describeMethod('checkAccess', () => {
        it('should succeed if user is an admin', () => {
            req.userData = {
                login: '',
                admin: true,
            };
            admin.checkAccess(...wrapExpressMocks(req, res, next));
            expect(next.error).undefined;
        });

        it('should fail if user is not an admin', () => {
            req.userData = {
                login: '',
                admin: false,
            };
            admin.checkAccess(...wrapExpressMocks(req, res, next));
            expect(next.error).instanceOf(ApiError);
        });
    });

    describeMethod('setUser', () => {
        it('should set user', async () => {
            req.body = {
                login: 'name',
                password: 'pwd',
                admin: false,
                active: true,
            };
            await admin.setUser(...wrapExpressMocks<ISetUserParams>(req, res, next));
            expect(JSON.stringify(res.data)).eq('{}');
        }).slow(300);

        it('should fail on invalid input', async () => {
            req.body = {
                login: 'name',
                password: 'pwd',
                admin: false,
                active: 'yes',
            };
            await admin.setUser(...wrapExpressMocks<ISetUserParams>(req, res, next));
            expect(next.error).instanceOf(ApiError);
        });
    });

    describeMethod('uploadClassifiers', () => {
        it('should insert classifiers', async () => {
            req.body = uploadCsv;
            await admin.uploadClassifiers(...wrapExpressMocks<string>(req, res, next));
            expect(UploadClientMock.client.calls).deep.eq(uploadSql);
            expect(JSON.stringify(res.data)).eq('{}');
        });

        it('should fail on malformed input', async () => {
            for await (const csv of uploadCsvErr) {
                req.body = csv;
                next.error = undefined;
                await admin.uploadClassifiers(...wrapExpressMocks<string>(req, res, next));
                expect(next.error).instanceOf(Error);
            }
        });

        it('should rollback on SQL error', async () => {
            req.body = uploadCsv;
            UploadClientMock.setThrowId(1);
            await admin.uploadClassifiers(...wrapExpressMocks<string>(req, res, next));
            const lastCall = UploadClientMock.client.calls.pop();
            expect(lastCall).deep.eq(['query', 'ROLLBACK']);
            expect(next.error).instanceOf(Error)
                .property('message', 'sql error');
        });
    });
});
