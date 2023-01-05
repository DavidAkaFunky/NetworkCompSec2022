import { Router } from 'express';
import { authRoutes } from './authRoute';
import { stockRoutes } from './stockRoute';
import { userRoutes } from './userRoute';
import { loanRoutes } from './loanRoute';
import { portugalBankRoutes } from './BankPortugalRoute';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/stocks', stockRoutes);
router.use('/users', userRoutes);
router.use('/loans', loanRoutes);
router.use('/portugal-bank', portugalBankRoutes);

export default router;