import { Router, Request, Response } from "express";
import { registerUser } from "../services/usersService";

const router = Router();

router.post("/register", (req: Request, res: Response): void => {
    const user = registerUser(req.body.user);
    res.json({ user });
});

router.post("/login", (req: Request, res: Response): void => {
    // TODO
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