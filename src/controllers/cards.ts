import { NextFunction, Request, Response } from 'express';
import { Error, MongooseError } from 'mongoose';
import Card from '../models/card';
import { ServerError } from '../errors/ServerError';
import { NOT_FOUND_ERROR_CODE, REQUEST_ERROR_CODE } from '../errors/codes';
import { getValidationErrorString } from '../utils/errors';

export const getCards = (req: Request, res: Response, next: Function) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((error) => {
      next(new ServerError(error));
    });
};

export const deleteCardById = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndDelete(req.params.id)
    .then((card) => {
      if (!card) {
        next(new ServerError({ statusCode: NOT_FOUND_ERROR_CODE, message: 'Карточка не найдена' }));
      } else {
        res.send(card);
      }
    })
    .catch(() => {
      next(new ServerError());
    });
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const newCard = {
    name: req.body.name,
    link: req.body.link,
    owner: (req as any).user._id,
  };
  Card.create(newCard)
    .then((card) => {
      res.send(card);
    })
    .catch((error: MongooseError) => {
      if (error instanceof Error.ValidationError) {
        const message = getValidationErrorString(error);
        next(new ServerError({ message, statusCode: REQUEST_ERROR_CODE }));
      } else {
        next(new ServerError());
      }
    });
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: (req as any).user._id } },
    { new: true },
  ).then((card) => {
    if (!card) {
      next(new ServerError({ statusCode: NOT_FOUND_ERROR_CODE, message: 'Карточка не найдена' }));
    } else {
      res.send(card);
    }
  }).catch(() => {
    next(new ServerError());
  });
};

export const deleteLikeFromCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: (req as any).user._id } },
    { new: true },
  ).then((card) => {
    if (!card) {
      next(new ServerError({ statusCode: NOT_FOUND_ERROR_CODE, message: 'Карточка не найдена' }));
    } else {
      res.send(card);
    }
  }).catch(() => {
    next(new ServerError());
  });
};
