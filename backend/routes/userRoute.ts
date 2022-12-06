import express, { Request, Response } from "express";

export const userRoute = express.Router();

// express validator existe

userRoute.get("/users", (req: Request, res: Response): void => {
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

userRoute.post("/user/:userId/details", (req: Request, res: Response): void => {
    const userId = req.params.userId;
    res.json({
        userid: userId,
        username: "idk",
        email: "smt@gmail.com",    
    });
});

userRoute.post("/login", (req: Request, res: Response): void => {
    const username = req.body.user;
    const password = req.body.password;
    console.log(username, password)
    res.json({
        token: "omegatoken",
    });
});