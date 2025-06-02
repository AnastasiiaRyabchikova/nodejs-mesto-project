import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import handleErrors from './errors/handleErrors';
import UserRouter from './routes/users';
import CardsRouter from './routes/cards';
import { ServerError } from './errors/ServerError';
import { NOT_FOUND_ERROR_CODE } from './errors/codes';

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req: Request, res: Response, next: Function) => {
  (req as any).user = {
    _id: '683a1d1119d8d3d15ce10b66',
  };

  next();
});
app.use('/users', UserRouter);
app.use('/cards', CardsRouter);

app.use((req, res, next) => {
  next(new ServerError({ statusCode: NOT_FOUND_ERROR_CODE, message: 'Страница не найдена' }));
});

app.use(handleErrors);

app.listen(port);
