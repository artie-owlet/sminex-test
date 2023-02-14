/* eslint-disable newline-per-chained-call */
import { get as getEnv } from 'env-var';
import { PoolConfig } from 'pg';

export interface IConfig {
    db: {
        admin: PoolConfig;
        client: PoolConfig;
    };
    port: number;
    secret: string;
}

let config: IConfig | undefined;

export function getConfig(): IConfig {
    /* istanbul ignore next */
    if (config !== undefined) {
        return config;
    }

    config = {
        db: {
            admin: {
                host: getEnv('DB_HOST').required().asString(),
                port: getEnv('DB_PORT').required().asPortNumber(),
                database: getEnv('DB_NAME').required().asString(),
                user: getEnv('DB_ADMIN_USER').default('sminex_admin').asString(),
                password: getEnv('DB_ADMIN_PASSWORD').required().asString(),
                max: getEnv('DB_POOL_MAX').default(8).asIntPositive(),
            },
            client: {
                host: getEnv('DB_HOST').required().asString(),
                port: getEnv('DB_PORT').required().asPortNumber(),
                database: getEnv('DB_NAME').required().asString(),
                user: getEnv('DB_CLIENT_USER').default('sminex_client').asString(),
                password: getEnv('DB_CLIENT_PASSWORD').required().asString(),
                max: getEnv('DB_POOL_MAX').default(8).asIntPositive(),
            },
        },
        port: getEnv('APP_PORT').required().asPortNumber(),
        secret: getEnv('APP_SECRET').required().asString(),
    };
    return config;
}
