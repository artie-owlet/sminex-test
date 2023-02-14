import { compare } from 'bcrypt';
import { CookieOptions, NextFunction, Response } from 'express';
import { sign, verify, JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import { ClientDatabase } from '../service/client-database';
import { IApiRequest, IUserData } from './api-request';
import { ApiError } from './error';

interface ILoginData {
    login?: string;
    password?: string;
}

const AUTH_TOKEN_TTL = '1h';
const REFRESH_TOKEN_TTL = '30d';
const cookieOpts: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
};

export class Auth {
    constructor(
        private db: ClientDatabase,
        private secret: string,
    ) {
    }

    public async login(req: IApiRequest<ILoginData>, res: Response, next: NextFunction): Promise<void> {
        try {
            const login = req.body.login;
            const password = req.body.password;
            if (typeof login !== 'string' || typeof password !== 'string') {
                throw new ApiError('Invalid params', 'Invalid params');
            }
            const userRecord = await this.db.getUserData(login);
            if (!userRecord) {
                throw new ApiError(`Unknown login ${login}`);
            }
            if (!userRecord.active) {
                throw new ApiError(`User blocked, login=${login}`);
            }
            if (!await compare(password, userRecord.passhash)) {
                throw new ApiError(`Wrong password, login=${login}, password=${password}`);
            }
    
            await this.setUserToken(login, userRecord.admin, res);
            res.send({});
        } catch (err) {
            next(err);
        }
    }

    public async auth(req: IApiRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            if (typeof req.cookies.auth !== 'string') {
                throw new ApiError('No auth token');
            }
            try {
                req.userData = verify(req.cookies.auth, this.secret) as IUserData;
            } catch (err) {
                if (err instanceof TokenExpiredError) {
                    await this.reauth(req, res);
                } else if (err instanceof JsonWebTokenError) {
                    throw new ApiError(`JWT Error on auth token: ${err.message}`);
                } else {
                    throw err;
                }
            }
            next();
        } catch (err) {
            next(err);
        }
    }

    private async reauth(req: IApiRequest, res: Response): Promise<void> {
        if (typeof req.cookies.refresh !== 'string') {
            throw new ApiError('No refresh token');
        }
        let login: string;
        try {
            login = (verify(req.cookies.refresh, this.secret) as {login: string;}).login;
        } catch (err) {
            if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError) {
                throw new ApiError(`JWT Error on refresh token: ${err.message}`);
            } else {
                throw err;
            }
        }

        const userRecord = await this.db.getUserData(login);
        if (!userRecord) {
            throw new ApiError(`Unknown login ${login}`);
        }
        if (!userRecord.active) {
            throw new ApiError(`User blocked, login=${login}`);
        }
        if (req.cookies.refresh !== userRecord.token) {
            throw new ApiError(`Wrong refresh token, login=${login}`);
        }
        await this.setUserToken(login, userRecord.admin, res);
        req.userData = {
            login,
            admin: userRecord.admin,
        };
    }

    private async setUserToken(login: string, admin: boolean, res: Response): Promise<void> {
        const authToken = sign({
            login,
            admin,
        }, this.secret, {
            expiresIn: AUTH_TOKEN_TTL,
        });
        const refreshToken = sign({
            login,
        }, this.secret, {
            expiresIn: REFRESH_TOKEN_TTL,
        });
        await this.db.setUserToken(login, refreshToken);
        res.cookie('auth', authToken, cookieOpts)
            .cookie('refresh', refreshToken, cookieOpts);
    }
}
