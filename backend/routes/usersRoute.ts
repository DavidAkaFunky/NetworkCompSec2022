import express, { Request, Response } from "express";
const { usersService } = require('../services');

const router = express.Router();

router.use(express.json());
// express validator existe

router.post("/create", async (req: Request, res: Response): Promise<void> => {
    res.json({requestBody: req.body});
    const username = req.body.username;
    const pwd = req.body.pwd;
    console.log(username, pwd);
    await usersService.addUser(username, pwd);
    res.json(username);
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

usersRoute.post("/login", (req: Request, res: Response): void => {
    const username = req.body.user;
    const password = req.body.password;
    console.log(username, password)
    res.json({
        token: "omegatoken",
    });
});*/