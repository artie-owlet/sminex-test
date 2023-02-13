import EventEmitter from 'events';

import { Pool, PoolClient, PoolConfig } from 'pg';

interface IDatabaseEvents {
    error: (err: Error) => void;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface Database {
    on<E extends keyof IDatabaseEvents>(event: E, listener: IDatabaseEvents[E]): this;
    once<E extends keyof IDatabaseEvents>(event: E, listener: IDatabaseEvents[E]): this;
    addListener<E extends keyof IDatabaseEvents>(event: E, listener: IDatabaseEvents[E]): this;
    prependListener<E extends keyof IDatabaseEvents>(event: E, listener: IDatabaseEvents[E]): this;
    prependOnceListener<E extends keyof IDatabaseEvents>(event: E, listener: IDatabaseEvents[E]): this;
    emit<E extends keyof IDatabaseEvents>(event: E, ...params: Parameters<IDatabaseEvents[E]>): boolean;
}

export class Database extends EventEmitter {
    protected db: Pool;

    constructor(conf: PoolConfig) {
        super();

        this.db = new Pool(conf);
        this.db.on('error', (err) => this.emit('error', err));
        this.db.on('connect', this.onConnect.bind(this));
    }

    private async onConnect(client: PoolClient): Promise<void> {
        try {
            await client.query('SET search_path = sminex');
        } catch (err) {
            this.emit('error', err instanceof Error ? err : new Error(String(err)));
        }
    }
}
