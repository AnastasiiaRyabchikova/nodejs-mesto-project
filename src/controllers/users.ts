import { NextFunction, Request, Response } from 'express';
import { Error, MongooseError } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { ServerError } from '../errors/ServerError';
import {
  AUTHORIZATION_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  REQUEST_ERROR_CODE,
  UNHANDLED_SERVER_ERROR_CODE,
} from '../errors/codes';
import { getValidationErrorString } from '../utils/errors';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((error) => {
      next(new ServerError(error));
    });
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        next(new ServerError({ statusCode: NOT_FOUND_ERROR_CODE, message: 'Пользователь не найден' }));
      } else {
        res.send(user);
      }
    })
    .catch(() => {
      next(new ServerError({ statusCode: UNHANDLED_SERVER_ERROR_CODE }));
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
      res.send({
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((error: MongooseError) => {
      if (error instanceof Error.ValidationError) {
        const message = getValidationErrorString(error);
        next(new ServerError({ message, statusCode: REQUEST_ERROR_CODE }));
      } else {
        next(new ServerError({ statusCode: UNHANDLED_SERVER_ERROR_CODE }));
      }
    });
};

export const getMe = (req: Request, res: Response, next: NextFunction) => {
  User.findById((req as any).user._id)
    .then((user) => {
      if (!user) {
        next(new ServerError({ statusCode: NOT_FOUND_ERROR_CODE, message: 'Пользователь не найден' }));
      } else {
        res.send(user);
      }
    });
};

export const updateMe = (req: Request, res: Response, next: NextFunction) => {
  const updatedUser = {
    name: req.body.name,
    about: req.body.about,
    avatar: req.body.avatar,
  };

  User.findByIdAndUpdate((req as any).user._id, updatedUser, { new: true })
    .then((user) => {
      if (!user) {
        next(new ServerError({ statusCode: NOT_FOUND_ERROR_CODE, message: 'Пользователь не найден' }));
      } else {
        res.send(user);
      }
    })
    .catch((error) => {
      if (error instanceof Error.ValidationError) {
        const message = getValidationErrorString(error);
        next(new ServerError({ message, statusCode: REQUEST_ERROR_CODE }));
      } else {
        next(new ServerError({ statusCode: UNHANDLED_SERVER_ERROR_CODE }));
      }
    });
};

export const updateMyAvatar = (req: Request, res: Response, next: NextFunction) => {
  const updatedUser = {
    avatar: req.body.avatar || '',
  };

  User.findByIdAndUpdate((req as any).user._id, updatedUser, { new: true })
    .then((user) => {
      if (!user) {
        next(new ServerError({ statusCode: NOT_FOUND_ERROR_CODE, message: 'Пользователь не найден' }));
      } else {
        res.send(user);
      }
    })
    .catch((error) => {
      if (error instanceof Error.ValidationError) {
        const message = getValidationErrorString(error);
        next(new ServerError({ message, statusCode: REQUEST_ERROR_CODE }));
      } else {
        next(new ServerError({ statusCode: UNHANDLED_SERVER_ERROR_CODE }));
      }
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  User.findOne({ email: req.body.email }).select('+password')
    .then((user) => {
      if (!user) {
        next(new ServerError({ statusCode: AUTHORIZATION_ERROR_CODE, message: 'Неверные почта или пароль' }));
      } else {
        bcrypt.compare(req.body.password, user.password)
          .then((isMatch) => {
            if (!isMatch) {
              next(new ServerError({ statusCode: AUTHORIZATION_ERROR_CODE, message: 'Неверные почта или пароль' }));
            } else {
              const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
              res.cookie('httpOnly', token);
              res.send(user);
            }
          });
      }
    })
    .catch((error) => {
      if (error instanceof Error.ValidationError) {
        const message = getValidationErrorString(error);
        next(new ServerError({ message, statusCode: REQUEST_ERROR_CODE }));
      } else {
        next(new ServerError({ statusCode: UNHANDLED_SERVER_ERROR_CODE }));
      }
    });
};
