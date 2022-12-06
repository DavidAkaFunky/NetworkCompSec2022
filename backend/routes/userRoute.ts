import express, { Request, Response } from 'express';

export const userRoute = express.Router();

// express validator existe

userRoute.get('/users', (req: Request, res: Response): void => {
    res.json({
        username: 'test',
        password: 'test',
    });
});