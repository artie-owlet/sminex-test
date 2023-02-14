import { expect } from 'chai';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pg = require('pg') as typeof import('pg');

import { describeEvent } from './mocha-format';
import { promisifyEvent } from './promisify-event';
import { ClientMock, PoolMock } from './mock/pg';

import { Database } from '../src/service/database';

describe('Database', () => {
    let pgPoolOrig: typeof pg.Pool;

    before(() => {
        pgPoolOrig = pg.Pool;
        pg.Pool = PoolMock as unknown as typeof pg.Pool;
    });

    after(() => {
        pg.Pool = pgPoolOrig;
    });

    afterEach(() => {
        PoolMock.clear();
    });

    describe('constructor', () => {
        it('should create pool', () => {
            const conf = {
                host: 'localhost',
            };
            new Database(conf);
            expect(PoolMock.isCreated()).eq(true);
            expect(PoolMock.pool.conf).deep.eq(conf);
        });

        it('should set schema for client', () => {
            new Database({});
            const cli = new ClientMock();
            PoolMock.pool.emit('connect', cli);
            expect(cli.calls).deep.eq([
                ['query', 'SET search_path = sminex'],
            ]);
        });
    });

    describeEvent('error', () => {
        it('should be emitted on pool error', async () => {
            const db = new Database({});
            const p = promisifyEvent<Error>(db, 'error');
            PoolMock.pool.emit('error', new Error('test error'));
            const err = await p;
            expect(err).instanceOf(Error)
                .property('message', 'test error');
        });
    });
});
