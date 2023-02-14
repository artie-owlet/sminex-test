import { IClassifierRecord } from '../../src/service/client-database';

import { clAll, clByCode } from '../data/classifiers';

export class ClientDatabaseMock {
    public async getClassifiersByCode(): Promise<IClassifierRecord[]> {
        await Promise.resolve();
        return clByCode.map((cl) => {
            return {
                id: cl[0],
                code: cl[1],
                description: cl[2],
                level: cl[3],
                parentId: cl[4],
            };
        });
    }

    public async getAllClassifiers(): Promise<IClassifierRecord[]> {
        await Promise.resolve();
        return clAll.map((cl) => {
            return {
                id: cl[0],
                code: cl[1],
                description: cl[2],
                level: cl[3],
                parentId: cl[4],
            };
        });
    }
}
