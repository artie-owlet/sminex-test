import cookieParser from 'cookie-parser';
import express from 'express';
import { json as jsonParser } from 'express';

import { getConfig } from './config';
import { log } from './log';
import { AdminDatabase } from './service/admin-database';
import { ClientDatabase } from './service/client-database';
import { Auth } from './model/auth';
import { Admin } from './model/admin';
import { Client } from './model/client';
import { onError } from './model/error';

import swaggerUi from 'swagger-ui-express';
import doc from './openapi.json';

try {
    const conf = getConfig();

    const adminDb = new AdminDatabase(conf.db.admin);
    adminDb.on('error', (err) => log.error(err.message));
    const clientDb = new ClientDatabase(conf.db.client);
    clientDb.on('error', (err) => log.error(err.message));
    
    const auth = new Auth(clientDb, conf.secret);
    
    const app = express();
    app.set('trust proxy', true);

    app.post('/login', jsonParser({
        type: 'application/json',
        strict: true,
    }), auth.login.bind(auth));
    app.use('/admin/v1', cookieParser(), auth.auth.bind(auth), Admin.createRouter(adminDb));
    app.use('/client/v1', cookieParser(), auth.auth.bind(auth), Client.createRouter(clientDb));

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(doc));

    app.use(onError);

    app.listen(conf.port, '0.0.0.0', () => log.info('Application started'));
} catch (err) {
    log.error(err instanceof Error ? err.message : String(err));
}
