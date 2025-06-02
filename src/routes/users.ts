import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateMe,
  updateMyAvatar,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.patch('/me', updateMe);
router.patch('/me/avatar', updateMyAvatar);

export default router;
