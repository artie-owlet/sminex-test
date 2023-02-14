import { expect } from 'chai';

import process from 'process';

import { getConfig } from '../src/config';

const APP_PORT = 8080;
const APP_SECRET = 'sminex-secret';
const DB_HOST = 'db';
const DB_PORT = 5432;
const DB_NAME = 'sminex';
const DB_ADMIN_USER = 'admin';
const DB_ADMIN_PASSWORD = 'admin-password';
const DB_CLIENT_USER = 'client';
const DB_CLIENT_PASSWORD = 'client-password';
const DB_POOL_MAX = 8;

process.env['APP_PORT'] = '8080';
process.env['APP_SECRET'] = 'sminex-secret';
process.env['DB_HOST'] = 'db';
process.env['DB_PORT'] = '5432';
process.env['DB_NAME'] = 'sminex';
process.env['DB_ADMIN_USER'] = 'admin';
process.env['DB_ADMIN_PASSWORD'] = 'admin-password';
process.env['DB_CLIENT_USER'] = 'client';
process.env['DB_CLIENT_PASSWORD'] = 'client-password';
process.env['DB_POOL_MAX'] = '8';


describe('getConfig', () => {
    it('should return config', () => {
        expect(getConfig()).deep.eq({
            db: {
                admin: {
                    host: DB_HOST,
                    port: DB_PORT,
                    database: DB_NAME,
                    user: DB_ADMIN_USER,
                    password: DB_ADMIN_PASSWORD,
                    max: DB_POOL_MAX,
                },
                client: {
                    host: DB_HOST,
                    port: DB_PORT,
                    database: DB_NAME,
                    user: DB_CLIENT_USER,
                    password: DB_CLIENT_PASSWORD,
                    max: DB_POOL_MAX,
                },
            },
            port: APP_PORT,
            secret: APP_SECRET,
        });
    });
});
