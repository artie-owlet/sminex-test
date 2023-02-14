/* eslint-disable prefer-rest-params */
import { BaseMock } from './base-mock';

export class ClientMock extends BaseMock {
    public async query(): Promise<void> {
        this.recordCall(arguments);
        await Promise.resolve();
    }
}

export class UploadClientMock extends BaseMock {
    private static _client?: UploadClientMock;
    private static _throwId?: number;

    public static get client(): UploadClientMock {
        if (!UploadClientMock._client) {
            throw new Error('client is undefined');
        }
        return UploadClientMock._client;
    }

    public static setThrowId(id: number): void {
        UploadClientMock._throwId = id;
    }

    public static clear(): void {
        UploadClientMock._client = undefined;
        UploadClientMock._throwId = undefined;
    }

    private id = 0;

    constructor() {
        super();
        UploadClientMock._client = this;
    }

    public async query(query: string): Promise<unknown> {
        await Promise.resolve();
        if (query.startsWith('INSERT')) {
            arguments[0] = 'INSERT';
            this.recordCall(arguments);
            if (UploadClientMock._throwId === this.id) {
                throw new Error('sql error');
            }
            return {
                rows: [{
                    clId: ++this.id,
                }],
            };
        } else {
            this.recordCall(arguments);
            return {
                rows: [],
            };
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public release(): void {
    }
}

export class PoolMock extends BaseMock {
    private static _pool?: PoolMock;

    public static isCreated(): boolean {
        return PoolMock._pool !== undefined;
    }

    public static get pool(): PoolMock {
        if (!PoolMock._pool) {
            throw new Error('pool is undefined');
        }
        return PoolMock._pool;
    }

    public static clear(): void {
        PoolMock._pool = undefined;
    }

    constructor(
        public readonly conf: unknown,
    ) {
        super();
        PoolMock._pool = this;
    }

    public async query(query: string): Promise<void> {
        arguments[0] = query.split(' ')[0];
        this.recordCall(arguments);
        await Promise.resolve();
    }

    public async connect(): Promise<UploadClientMock> {
        await Promise.resolve();
        return new UploadClientMock();
    }
}
