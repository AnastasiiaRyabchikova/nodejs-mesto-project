import { ErrorRequestHandler } from 'express';
import { INTERNAL_SERVER_ERROR_CODE } from '../requests/codes';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || INTERNAL_SERVER_ERROR_CODE;
  const message = statusCode === INTERNAL_SERVER_ERROR_CODE ? 'На сервере произошла ошибка' : err.message;
  res
    .status(statusCode)
    .send({ message });
  next();
};

export default errorHandler;
