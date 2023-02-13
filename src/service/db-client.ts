import { Database } from './db';

export interface IUserRecord {
    passhash: string;
    token: string | null;
    admin: boolean;
    active: boolean;
}

interface IClassifierRecord {
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

    public async getClassifier(code: string): Promise<IClassifierRecord[]> {
        const res = [] as IClassifierRecord[];
        const {rows} = await this.db.query<IClassifierRecord>(
            `SELECT code, description, level, parent_id as parentId`
            + ` FROM classifiers WHERE code = $1 LIMIT 1`,
            [code]);
        if (rows.length === 0) {
            return [];
        }
        res.push(rows[0]);
        let level = rows[0].level;
        let parentId = rows[0].parentId;
        do {
            const {rows} = await this.db.query<IClassifierRecord>(
                `SELECT code, description, level, parent_id as parentId`
                + ` FROM classifiers WHERE cl_id = $1 LIMIT 1`,
                [parentId]);
            if (rows.length === 0) {
                return res;
            }
            res.push(rows[0]);
            level = rows[0].level;
            parentId = rows[0].parentId;
        } while (level > 1);
        return res.reverse();
    }
}
