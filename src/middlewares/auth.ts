import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import AuthorizationError from '../requests/authorization-error';
import { AuthContext } from '../types/entities/user';

interface JwtPayload {
  _id: string;
}

export default (req: Request, res: Response<unknown, AuthContext>, next: Function) => {
  const { httpOnly } = req.cookies;
  try {
    const decoded = jwt.verify(httpOnly, 'some-secret-key') as JwtPayload;
    if (!decoded) {
      throw new Error();
    } else {
      if (typeof decoded === 'string') {
        throw new Error();
      }
      res.locals.user = decoded;
      next();
    }
  } catch (e) {
    next(new AuthorizationError('Ошибка авторизации'));
  }
};
