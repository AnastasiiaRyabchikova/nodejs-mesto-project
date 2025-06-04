import mongoose from 'mongoose';
import express from 'express';
import cookieParser from 'cookie-parser';
import errors from './middlewares/errors';
import UserRouter from './routes/users';
import CardsRouter from './routes/cards';
import { ServerError } from './errors/ServerError';
import { NOT_FOUND_ERROR_CODE } from './errors/codes';
import { login, createUser } from './controllers/users';
import auth from './middlewares/auth';
import logger from './middlewares/logger';

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger.requestLogger);
app.use(cookieParser());
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/users', UserRouter);
app.use('/cards', CardsRouter);
app.use(logger.errorLogger);

app.use((req, res, next) => {
  next(new ServerError({ statusCode: NOT_FOUND_ERROR_CODE, message: 'Страница не найдена' }));
});

app.use(errors);

app.listen(port);
