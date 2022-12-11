import { Router } from 'express';
import { usersRoutes } from './usersRoute';
import { productRoutes } from './productRoute';

const router: Router = Router();

router.use('/users', usersRoutes);
router.use('/products', productRoutes);

export default router;