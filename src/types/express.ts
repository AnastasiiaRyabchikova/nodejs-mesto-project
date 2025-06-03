import IUser from './entities/user';

export declare namespace Express {
  export interface Request {
    user?: IUser
  }
}
