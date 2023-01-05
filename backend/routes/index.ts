import { Router } from 'express';
import { TokenService } from '../services/index';
import { authRoutes } from './authRoute';
import { stockRoutes } from './stockRoute';
import { userRoutes } from './userRoute';
import { loanRoutes } from './loanRoute';
import { portugalBankRoutes } from './BankPortugalRoute';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/stocks', TokenService.authenticateAccessToken, stockRoutes);
router.use('/users', TokenService.authenticateAccessToken, userRoutes);
router.use('/loans', TokenService.authenticateAccessToken, loanRoutes);
router.use('/bankportugal', TokenService.authenticateAccessToken, portugalBankRoutes);

export default router;