import { NextFunction, Request, Response } from 'express';
import { Error, MongooseError } from 'mongoose';
import User from '../models/user';
import { ServerError } from '../errors/ServerError';
import { NOT_FOUND_ERROR_CODE, REQUEST_ERROR_CODE, UNHANDLED_SERVER_ERROR_CODE } from '../errors/codes';
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
  const newUser = {
    name: req.body.name,
    about: req.body.about,
    avatar: req.body.avatar,
  };

  User
    .create(newUser)
    .then((user) => {
      res.send(user);
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
