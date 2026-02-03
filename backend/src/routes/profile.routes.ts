import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { getProfile, updateProfile } from '../controllers/profile.controller';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/me', getProfile);
router.put('/me', updateProfile);

export default router;
