import { NextFunction, Request, Response } from 'express';
import { Error, MongooseError } from 'mongoose';
import Card from '../models/card';
import { ServerError } from '../errors/ServerError';
import {
  NOT_FOUND_ERROR_CODE,
  REQUEST_ERROR_CODE,
  FORBIDDEN_ERROR_CODE,
} from '../errors/codes';
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
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        next(new ServerError({ statusCode: NOT_FOUND_ERROR_CODE, message: 'Карточка не найдена' }));
      } else if (card.owner.toString() !== req.user?._id) {
        next(new ServerError({ statusCode: FORBIDDEN_ERROR_CODE, message: 'Нельзя удалять чужую карточку' }));
      } else {
        card.deleteOne().then(() => res.send({ message: 'Карточка удалена' }));
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
    owner: req.user?._id,
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
    { $addToSet: { likes: req.user?._id } },
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
    { $pull: { likes: req.user?._id } },
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
