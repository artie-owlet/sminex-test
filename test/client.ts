import { expect } from 'chai';

import { describeMethod } from './mocha-format';
import { ResultItemType, resultAll, resultByCode } from './data/classifiers';
import { ClientDatabaseMock } from './mock/client-database';
import { RequestMock, ResponseMock, NextMock, wrapExpressMocks } from './mock/express';

import { Client } from '../src/model/client';
import { ClientDatabase } from '../src/service/client-database';

interface IClassifierResult {
    code: string;
    description: string;
    level: number;
    path: string[];
}
function testDataToResult(data: ResultItemType[]): IClassifierResult[] {
    return data.map((cl) => {
        return {
            code: cl[0],
            description: cl[1],
            level: cl[2],
            path: cl[3],
        };
    });
}

describe('Client', () => {
    let client: Client;
    let req: RequestMock;
    let res: ResponseMock;
    let next: NextMock;

    beforeEach(() => {
        client = new Client(new ClientDatabaseMock() as unknown as ClientDatabase);
        req = new RequestMock();
        res = new ResponseMock();
        next = new NextMock();
    });

    describeMethod('getClassifiersByCode', () => {
        it('should return classifiers by code', async () => {
            req.params = {
                code: 'A10',
            };
            await client.getClassifiersByCode(...wrapExpressMocks(req, res, next));
            const result = testDataToResult(resultByCode);
            expect(res.data).deep.eq(result);
        });
    });

    describeMethod('getAllClassifiers', () => {
        it('should return all classifiers', async () => {
            await client.getAllClassifiers(...wrapExpressMocks(req, res, next));
            const result = testDataToResult(resultAll);
            expect(res.data).deep.eq(result);
        });
    });
});
