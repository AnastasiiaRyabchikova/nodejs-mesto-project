import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import AuthorizationError from '../requests/authorization-error';
import NotFoundError from '../requests/not-found';
import RequestError from '../requests/request-error';
import DublicateError from '../requests/dublicate-error';
import { getValidationErrorString } from '../utils/errors';
import { CREATED_SUCCES_CODE } from '../requests/codes';
import { AuthContext } from '../types/entities/user';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((error) => {
      next(error);
    });
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
      } else {
        res.send(user);
      }
    })
    .catch((error) => {
      if (error instanceof MongooseError.CastError) {
        next(new RequestError('Передан неправильный id'));
      } else {
        next(error);
      }
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => (
      User.create({
        name: req.body.name,
        about: req.body.about,
        avatar: req.body.avatar,
        email: req.body.email,
        password: hash,
      })
    ))
    .then((user) => {
      res.status(CREATED_SUCCES_CODE)
        .send({
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        });
    })
    .catch((error) => {
      if (error instanceof Error && error.message.includes('E11000')) {
        next(new DublicateError('Почта уже занята'));
      } else if (error instanceof MongooseError.ValidationError) {
        const message = getValidationErrorString(error);
        next(new DublicateError(message));
      } else {
        next(error);
      }
    });
};

export const getMe = (req: Request, res: Response, next: NextFunction) => {
  const { user } = res.locals;
  User.findById(user._id)
    .then((me) => {
      if (!me) {
        next(new NotFoundError('Пользователь не найден'));
      } else {
        res.send(me);
      }
    });
};

export const updateMe = (req: Request, res: Response<unknown, AuthContext>, next: NextFunction) => {
  const updatedUser = {
    name: req.body.name,
    about: req.body.about,
    avatar: req.body.avatar,
  };

  User.findByIdAndUpdate(res.locals.user?._id, updatedUser, { new: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
      } else {
        res.send(user);
      }
    })
    .catch((error) => {
      if (error instanceof MongooseError.ValidationError) {
        const message = getValidationErrorString(error);
        next(new RequestError(message));
      } else {
        next(error);
      }
    });
};

export const updateMyAvatar = (
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  const updatedUser = {
    avatar: req.body.avatar || '',
  };

  User.findByIdAndUpdate(res.locals.user._id, updatedUser, { new: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
      } else {
        res.send(user);
      }
    })
    .catch((error) => {
      if (error instanceof MongooseError.ValidationError) {
        const message = getValidationErrorString(error);
        next(new RequestError(message));
      } else {
        next(error);
      }
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  User.findOne({ email: req.body.email }).select('+password')
    .then((user) => {
      if (!user) {
        next(new AuthorizationError('Неверные почта или пароль'));
      } else {
        bcrypt.compare(req.body.password, user.password)
          .then((isMatch) => {
            if (!isMatch) {
              next(new AuthorizationError('Неверные почта или пароль'));
            } else {
              const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
              res.cookie('httpOnly', token);
              res.send({
                _id: user._id,
                name: user.name,
                about: user.about,
                avatar: user.avatar,
                email: user.email,
              });
            }
          });
      }
    })
    .catch((error) => {
      if (error instanceof MongooseError.ValidationError) {
        const message = getValidationErrorString(error);
        next(new RequestError(message));
      } else {
        next(error);
      }
    });
};
