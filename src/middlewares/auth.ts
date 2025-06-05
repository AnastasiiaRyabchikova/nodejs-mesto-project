import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import AuthorizationError from '../errors/authorization-error';

export default (req: Request, res: Response, next: Function) => {
  const { httpOnly } = req.cookies;
  try {
    const decoded: { _id: string } | string | undefined = httpOnly ? jwt.verify(httpOnly, 'some-secret-key') : '';
    if (!decoded) {
      throw new Error();
    } else {
      if (typeof decoded === 'string') {
        throw new Error();
      }
      req.user = decoded;
      next();
    }
  } catch (e) {
    next(new AuthorizationError('Ошибка авторизации'));
  }
};
