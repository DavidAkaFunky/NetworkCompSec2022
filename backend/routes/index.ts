import { Router } from 'express';
import { TokenService } from '../services/index';
import { authRoutes } from './authRoute';
import { stockRoutes } from './stockRoute';
import { userRoutes } from './userRoute';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/stocks', TokenService.authenticateAccessToken, stockRoutes);
router.use('/users', TokenService.authenticateAccessToken, userRoutes);

export default router;