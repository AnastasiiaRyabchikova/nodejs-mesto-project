import { NextFunction, Request, Response } from 'express';
import { Error, MongooseError } from 'mongoose';
import Card from '../models/card';
import NotFoundError from '../requests/not-found';
import RequestError from '../requests/request-error';
import ForbidenError from '../requests/forbiden-error';
import { getValidationErrorString } from '../utils/errors';
import { CREATED_SUCCES_CODE } from '../requests/codes';

export const getCards = (req: Request, res: Response, next: Function) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((error) => {
      next(error);
    });
};

export const deleteCardById = (req: Request, res: Response, next: NextFunction) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      const { user } = res.locals;
      if (!card) {
        next(new NotFoundError('Карточка не найдена'));
      } else if (card.owner.toString() !== user._id) {
        next(new ForbidenError('Нельзя удалять чужую карточку'));
      } else {
        card.deleteOne().then(() => res.send({ message: 'Карточка удалена' }));
      }
    })
    .catch((error: MongooseError) => {
      if (error instanceof Error.CastError) {
        next(new RequestError('Передан неправильный id'));
      } else {
        next(error);
      }
    });
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { user } = res.locals;
  const newCard = {
    name: req.body.name,
    link: req.body.link,
    owner: user._id,
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
        next(error);
      }
    });
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  const { user } = res.locals;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: user._id } },
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
      next(error);
    }
  });
};

export const deleteLikeFromCard = (req: Request, res: Response, next: NextFunction) => {
  const { user } = res.locals;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: user?._id } },
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
      next(error);
    }
  });
};
