import { Request } from 'express';

interface IParamsDictionary {
    [key: string]: string;
}

interface ICookies {
    auth?: string;
    refresh?: string;
}

export interface IUserData {
    login: string;
    admin: boolean;
}

export interface IApiRequest<T = unknown> extends Request<IParamsDictionary, unknown, T> {
    userData?: IUserData;
    cookies: ICookies;
}
