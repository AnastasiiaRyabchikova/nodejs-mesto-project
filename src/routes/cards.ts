import { Router } from 'express';
import {
  getCards,
  deleteCardById,
  createCard,
  likeCard,
  deleteLikeFromCard,
} from '../controllers/cards';

const router = Router();

router.get('/', getCards);
router.delete('/:cardId', deleteCardById);
router.post('/', createCard);

router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', deleteLikeFromCard);

export default router;
