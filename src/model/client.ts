
import { Request, Response, Router } from 'express';

import { ClientDatabase } from '../service/db-client';

interface IGetClassifierResult {
    code: string;
    description: string;
    level: number;
    path: string[];
}

export class Client {
    public static createRouter(db: ClientDatabase): Router {
        const router = Router();
        const model = new Client(db);
        router.get('/classifier/:code', model.getClassifier.bind(model));
        return router;
    }

    constructor(
        private db: ClientDatabase,
    ) {
    }

    public async getClassifier(req: Request, res: Response): Promise<void> {
        const code = req.params['code'];
        const clList = await this.db.getClassifier(code);
        if (clList.length === 0) {
            res.status(404)
                .end({
                    error: 'Not found',
                });
            return;
        }

        const path = [] as string[];
        const result: IGetClassifierResult[] = clList.map((cl) => {
            path.push(cl.code);
            return {
                code: cl.code,
                description: cl.description,
                level: cl.level,
                path: [...path],
            };
        });
        res.end(result);
    }
}
