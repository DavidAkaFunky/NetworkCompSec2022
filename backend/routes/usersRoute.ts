import {Router, Request, Response } from "express";
import { registerUser } from '../services/usersService';

//const { usersService } = require('../services');

const router = Router();

//router.use(express.json());added in app index
// express validator existe

router.post("/register", async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await registerUser(req.body.user);
        res.json({ user });
    } catch (error) {
        //next(error);
    }
    
    //res.json({requestBody: req.body});
    //const username = req.body.username;
    //const pwd = req.body.pwd;
    //console.log(username, pwd);
    //await usersService.addUser(username, pwd);
    //res.json(username);//???
    ////returns nothing ??
});

router.post("/login", (req: Request, res: Response): void => {
    //why void???
    const username = req.body.user;
    const password = req.body.password;
    
    console.log(username, password)
    res.json({
        token: "omegatoken",
    });
});

/*usersRoute.get("/users", (req: Request, res: Response): void => {
    res.json([
        {
            username: "user1",
            password: "pwd",    
        },
        {
            username: "user2",
            password: "gato",    
        },
    ]);
});

usersRoute.post("/user/:userId/details", (req: Request, res: Response): void => {
    const userId = req.params.userId;
    res.json({
        userid: userId,
        username: "idk",
        email: "smt@gmail.com",    
    });
});

*/

export const usersRoutes: Router = router;