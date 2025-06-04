import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ServerError } from '../errors/ServerError';

export default (req: Request, res: Response, next: Function) => {
  const { httpOnly } = req.cookies;
  const token:string = Array.isArray(httpOnly) ? httpOnly[0] : httpOnly || '';
  const decoded = token ? jwt.verify(token, 'some-secret-key') : '';
  if (!decoded) {
    next(new ServerError({ statusCode: 401, message: 'Ошибка авторизации' }));
  } else {
    (req as any).user = decoded;
    next();
  }
};
