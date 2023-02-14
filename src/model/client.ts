import { NextFunction, Request, Response, Router } from 'express';

import { ClientDatabase, IClassifierRecord } from '../service/db-client';

interface IClassifier {
    code: string;
    description: string;
    level: number;
    path: string[];
}


function classifiersRecordsToResult(clList: IClassifierRecord[]): IClassifier[] {
    const clMap = new Map<number, IClassifier>();
    return clList.map((clRec) => {
        const parent = clMap.get(clRec.parentId);
        const cl: IClassifier = {
            code: clRec.code,
            description: clRec.description,
            level: clRec.level,
            path: (parent !== undefined) ? [...parent.path, clRec.code] : [clRec.code],
        };
        clMap.set(clRec.id, cl);
        return cl;
    });
}

export class Client {
    public static createRouter(db: ClientDatabase): Router {
        const router = Router();
        const model = new Client(db);
        router.get('/classifiers/:code', model.getClassifiersByCode.bind(model));
        router.get('/classifiers', model.getAllClassifiers.bind(model));
        return router;
    }

    constructor(
        private db: ClientDatabase,
    ) {
    }

    public async getClassifiersByCode(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const code = req.params['code'];
            const clList = await this.db.getClassifiersByCode(code);
            res.send(classifiersRecordsToResult(clList));
        } catch (err) {
            next(err);
        }
    }

    public async getAllClassifiers(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const clList = await this.db.getAllClassifiers();
            res.send(classifiersRecordsToResult(clList));
        } catch (err) {
            next(err);
        }
    }
}
