import { Router } from 'express';
import {
    accessUser,
    refreshToken,
    refreshUser,
    signOut
} from '../controllers/login.controller.js';
import { authenticate } from '../utils/authenticate.js';

const router = Router();

router.post('/', accessUser);
router.post('/refresh-token', refreshToken);
router.get('/user', authenticate, refreshUser)
router.delete('/signout', signOut);


export default router;