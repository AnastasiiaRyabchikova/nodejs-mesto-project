import { Router } from 'express';
import {
  getUsers,
  getMe,
  getUserById,
  createUser,
  updateMe,
  updateMyAvatar,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/me', getMe);
router.patch('/me', updateMe);
router.get('/:id', getUserById);
router.post('/', createUser);
router.patch('/me/avatar', updateMyAvatar);

export default router;
