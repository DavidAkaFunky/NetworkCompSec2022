import { Router } from 'express';
import { usersRoutes } from './authRoute';
import { productRoutes } from './productRoute';

const router: Router = Router();

router.use('/auth', usersRoutes);
router.use('/products', productRoutes);

export default router;