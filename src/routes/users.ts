import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import {
  getUsers,
  getMe,
  getUserById,
  updateMe,
  updateMyAvatar,
} from '../controllers/users';
import { validateAvatar, validateUid, validateUpdateUser } from '../utils/request-validation';

const router = Router();

router.get('/', getUsers);
router.get('/me', getMe);
router.patch('/me', validateUpdateUser, updateMe);
router.patch('/me/avatar', validateAvatar, updateMyAvatar);
router.get('/:userId', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: validateUid(),
  }),
}), getUserById);

export default router;
