import { Router } from 'express';
import { authRoutes } from './authRoute';
import { stockRoutes } from './stockRoute';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/stocks', stockRoutes);

export default router;