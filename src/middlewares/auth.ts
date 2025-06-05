import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ServerError } from '../errors/ServerError';
import { AUTHORIZATION_ERROR_CODE } from '../errors/codes';

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
    next(new ServerError({ statusCode: AUTHORIZATION_ERROR_CODE, message: 'Ошибка авторизации' }));
  }
};
