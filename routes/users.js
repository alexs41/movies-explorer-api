import { Router } from 'express';
import {
  updateUserInfo, getCurrentUser,
} from '../controllers/users.js';

import {
  celebrateBodyProfile,
} from '../validators/users.js';

const userRoutes = Router();

userRoutes.get('/me', getCurrentUser);
userRoutes.patch('/me', celebrateBodyProfile, updateUserInfo);

export default userRoutes;
