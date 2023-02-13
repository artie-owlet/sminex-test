import { hash } from 'bcrypt';
import { parse } from 'csv-parse/sync';
import { NextFunction, Response, Router, json as jsonParser, text as textParser } from 'express';

import { AdminDatabase, IClassifierNode } from '../service/db-admin';
import { IApiRequest } from './request';
import { ApiError } from './error';

interface ISetUserParams {
    login: string;
    password: string;
    admin: boolean;
    active: boolean;
}

const SALT_ROUNDS = 10;

class UploadParseError extends Error {}

export class Admin {
    public static createRouter(db: AdminDatabase): Router {
        const router = Router();
        const model = new Admin(db);
        router.use(model.checkAccess.bind(model));
        router.use(jsonParser({
            type: 'application/json',
            strict: true,
        }));
        router.post('/user', model.setUser.bind(model));
        router.post('/upload', textParser({
            type: 'text/csv',
            limit: '1mb',
        }), model.uploadClassifiers.bind(model));
        return router;
    }

    constructor(
        private db: AdminDatabase,
    ) {
    }

    public checkAccess(req: IApiRequest, _res: Response, next: NextFunction): void {
        if (req.userData === undefined || !req.userData.admin) {
            next(new ApiError('Not admin'));
        } else {
            next();
        }
    }

    public async setUser(req: IApiRequest<ISetUserParams>, res: Response, next: NextFunction): Promise<void> {
        try {
            const {
                login,
                password,
                admin,
                active,
            } = req.body;
            if (typeof login !== 'string' || typeof password !== 'string' ||
                typeof admin !== 'boolean' || typeof active !== 'boolean') {
                throw new ApiError('Invalid params', 'Invalid params');
            }
    
            const passhash = await hash(password, SALT_ROUNDS);
            await this.db.setUser(login, passhash, admin, active);
            res.send({});
        } catch (err) {
            next(err);
        }
    }

    public async uploadClassifiers(req: IApiRequest<string>, res: Response, next: NextFunction): Promise<void> {
        try {
            const records = parse(req.body, {
                delimiter: ';',
                fromLine: 2,
            }) as string[][];
            const path = [{
                code: '',
                description: '',
                children: [],
            }] as IClassifierNode[];
            let currentLevel = 1;
            records.forEach((line, lineId) => {
                try {
                    if (line.length < 3) {
                        throw new UploadParseError();
                    }
                    const level = parseInt(line[2]);
                    if (isNaN(level) || level < 1 || level - currentLevel > 1) {
                        throw new UploadParseError();
                    }
    
                    const cl: IClassifierNode = {
                        code: line[0],
                        description: line[1],
                        children: [],
                    };
                    path[level - 1].children.push(cl);
                    path[level] = cl;
                    currentLevel = level;
                } catch (err) {
                    if (err instanceof UploadParseError) {
                        throw new ApiError('Upload error', `Malformed file, at line ${lineId + 2}`);
                    }
                    throw err;
                }
            });
            await this.db.uploadClassifiers(path[0].children);
            res.send({});
        } catch (err) {
            next(err);
        }
    }
}
