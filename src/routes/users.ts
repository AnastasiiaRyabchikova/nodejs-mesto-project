import { Router } from 'express';
import {
  getUsers,
  getMe,
  getUserById,
  updateMe,
  updateMyAvatar,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/me', getMe);
router.patch('/me', updateMe);
router.patch('/me/avatar', updateMyAvatar);
router.get('/:userId', getUserById);

export default router;
