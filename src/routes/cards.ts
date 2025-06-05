import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import {
  getCards,
  deleteCardById,
  createCard,
  likeCard,
  deleteLikeFromCard,
} from '../controllers/cards';
import { validateCard, validateUid } from '../utils/request-validation';

const router = Router();

router.get('/', getCards);
router.delete('/:cardId', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: validateUid,
  }),
}), deleteCardById);
router.post('/', validateCard, createCard);

router.put('/:cardId/likes', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: validateUid,
  }),
}), likeCard);
router.delete('/:cardId/likes', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: validateUid,
  }),
}), deleteLikeFromCard);

export default router;
