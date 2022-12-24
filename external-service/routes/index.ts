import { Router } from 'express';
import { loanRoutes } from './loanRoute';
import { bankRoutes } from './bankRoute';

const router: Router = Router();

router.use('/loan', loanRoutes);
router.use('/bank', bankRoutes);

export default router;