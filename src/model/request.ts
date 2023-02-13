import { Request } from 'express';

interface ICookies {
    auth?: string;
    refresh?: string;
}

export interface IUserData {
    login: string;
    admin: boolean;
}

export interface IApiRequest<T = unknown> extends Request<unknown, unknown, T> {
    userData?: IUserData;
    cookies: ICookies;
}
