import { PoolClient } from 'pg';

import { Database } from './db';

export interface IClassifierNode {
    code: string;
    description: string;
    children: IClassifierNode[];
}

async function uploadClassifiers(client: PoolClient, data: IClassifierNode[], level: number, parentId: number
): Promise<void> {
    await Promise.all(data.map(async (cl) => {
        const {rows} = await client.query<{clId: number}>(
            `INSERT INTO classifiers (code, description, level, parent_id)`
            + ` VALUES($1, $2, $3, $4)`
            + ` RETURNING cl_id as clId`,
            [cl.code, cl.description, level, parentId]);
        if (rows.length === 0) {
            throw new Error(`Failed to insert classifier ${cl.code}`);
        }
        if (cl.children.length > 0) {
            return uploadClassifiers(client, cl.children, level + 1, rows[0].clId);
        }
    }));
}

export class AdminDatabase extends Database {
    public async setUser(login: string, passhash: string, admin: boolean, active: boolean): Promise<void> {
        await this.db.query<{userId: number;}>(
            `INSERT INTO users (login, passhash, admin, active)`
            + ` VALUES($1, $2, $3, $4)`
            + ` ON CONFLICT DO UPDATE SET passhash = $2, admin = $3, active = $4`
            + ` RETURNING user_id as userId`,
            [login, passhash, admin, active]);
    }

    public async uploadClassifiers(data: IClassifierNode[]): Promise<void> {
        const client = await this.db.connect();
        await client.query('START TRANSACTION');
        try {
            await uploadClassifiers(client, data, 1, 0);
            await client.query('COMMIT');
        } catch (err) {
            await client.query('ROLLBACK');
            client.release(true);
            throw err;
        }
    }
}
