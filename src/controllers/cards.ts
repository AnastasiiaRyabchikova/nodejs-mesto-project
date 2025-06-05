import { NextFunction, Request, Response } from 'express';
import { Error, MongooseError } from 'mongoose';
import Card from '../models/card';
import NotFoundError from '../requests/not-found';
import RequestError from '../requests/request-error';
import ForbidenError from '../requests/forbiden-error';
import InteranlServerError from '../requests/interanl-server-error';
import { getValidationErrorString } from '../utils/errors';
import { CREATED_SUCCES_CODE } from '../requests/codes';

export const getCards = (req: Request, res: Response, next: Function) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      next(new InteranlServerError());
    });
};

export const deleteCardById = (req: Request, res: Response, next: NextFunction) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка не найдена'));
      } else if (card.owner.toString() !== req.user?._id) {
        next(new ForbidenError('Нельзя удалять чужую карточку'));
      } else {
        card.deleteOne().then(() => res.send({ message: 'Карточка удалена' }));
      }
    })
    .catch((error: MongooseError) => {
      if (error instanceof Error.CastError) {
        next(new RequestError('Передан неправильный id'));
      } else {
        next(new InteranlServerError());
      }
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
      res.status(CREATED_SUCCES_CODE).send(card);
    })
    .catch((error: MongooseError) => {
      if (error instanceof Error.ValidationError) {
        const message = getValidationErrorString(error);
        next(new RequestError(message));
      } else {
        next(new InteranlServerError());
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
      next(new NotFoundError('Карточка не найдена'));
    } else {
      res.send(card);
    }
  }).catch((error: MongooseError) => {
    if (error instanceof Error.CastError) {
      next(new RequestError('Передан неправильный id'));
    } else {
      next(new InteranlServerError());
    }
  });
};

export const deleteLikeFromCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } },
    { new: true },
  ).then((card) => {
    if (!card) {
      next(new NotFoundError('Карточка не найдена'));
    } else {
      res.send(card);
    }
  }).catch((error: MongooseError) => {
    if (error instanceof Error.CastError) {
      next(new RequestError('Передан неправильный id'));
    } else {
      next(new InteranlServerError());
    }
  });
};
