import { Router } from 'express';
import { insuranceRoutes } from './insuranceRoute';
import { bankRoutes } from './bankRoute';

const router: Router = Router();

router.use('/insurance', insuranceRoutes);
router.use('/bank', bankRoutes);

export default router;