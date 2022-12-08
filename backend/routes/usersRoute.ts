import { Router, Request, Response } from "express";
import { usersService } from "../services";

const router = Router();

router.post("/register", async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await usersService.registerUser(req.body.user);
        res.json({ user });
    } catch (error) {
        //next(error);
    }
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