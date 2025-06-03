import { Request, Response } from 'express';
import { ServerError } from '../errors/ServerError';

export default (err: ServerError, req: Request, res: Response, next: Function) => {
  const message = err.statusCode === 500 ? 'На сервере произошла ошибка' : err.message;
  res
    .status(err.statusCode)
    .send({ message });
  next();
};
