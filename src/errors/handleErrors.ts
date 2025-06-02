import { Request, Response } from 'express';
import { ServerError } from './ServerError';

export default (err: ServerError, req: Request, res: Response, next: Function) => {
  res
    .status(err.statusCode)
    .send({ message: err.message });
  next();
};
