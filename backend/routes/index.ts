import { Router } from 'express';
import { usersRoutes } from './usersRoutes';


const router: Router = Router();

router.use('/users', usersRoutes);
//add more routes


export const mainRoute: Router = router;