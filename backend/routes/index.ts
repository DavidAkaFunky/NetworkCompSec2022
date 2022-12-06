import express from 'express';

import { userRoute } from './userRoute';

export const routes = express.Router();

routes.use(userRoute);