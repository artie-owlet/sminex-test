import { Database } from './db';

export interface IUserRecord {
    passhash: string;
    token: string | null;
    admin: boolean;
    active: boolean;
}

export interface IClassifierRecord {
    id: number;
    code: string;
    description: string;
    level: number;
    parentId: number;
}

export class ClientDatabase extends Database {
    public async getUserData(login: string): Promise<IUserRecord | null> {
        const {rows} = await this.db.query<IUserRecord>(
            `SELECT passhash, token, admin, active FROM users WHERE login = $1 LIMIT 1`,
            [login]);
        if (rows.length === 0) {
            return null;
        }
        return rows[0];
    }

    public async setUserToken(login: string, token: string | null): Promise<void> {
        await this.db.query(
            `UPDATE users SET token = $1 WHERE login = $2`,
            [token, login]);
    }

    public async getClassifiersByCode(code: string): Promise<IClassifierRecord[]> {
        const {rows} = await this.db.query<IClassifierRecord>(
            `WITH RECURSIVE r AS`
            + ` (SELECT cl_id, code, description, level, parent_id FROM classifiers WHERE code = $1`
            + ` UNION SELECT c.cl_id, c.code, c.description, c.level, c.parent_id FROM classifiers AS c`
            + ` INNER JOIN r on c.parent_id = r.cl_id)`
            + ` SELECT cl_id AS id, code, description, level, parent_id AS "parentId" FROM r ORDER BY level`,
            [code]);
        return rows;
    }

    public async getAllClassifiers(): Promise<IClassifierRecord[]> {
        const {rows} = await this.db.query<IClassifierRecord> (
            'SELECT cl_id AS id, code, description, level, parent_id AS "parentId" FROM classifiers ORDER BY level');
        return rows;
    }
}
