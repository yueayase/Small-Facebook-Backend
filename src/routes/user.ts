import { Request, Response } from "express";
import { Router } from "express";
import { Knex } from "knex";
import { mountSignupRouter } from "../controllers/signupController";
import { mountLoginRouter } from "../controllers/loginController";
import { mountGetUserProfileController } from "../controllers/getUserProfileController";
import { mountUploadCoverImageMiddleware } from "../middlewares/uploadCoverImageMiddleware";
import { mountUploadUserIconMiddleware } from "../middlewares/uploadUserIconMiddleware";

export const mountUserRouter = (knexSql: Knex) => {
    let router = Router();

    router.get("/user/:userId/profile", mountGetUserProfileController(knexSql));
    router.post("/signup", mountSignupRouter(knexSql));
    router.post("/login", mountLoginRouter(knexSql));
    router.post("/upload/cover_image", 
        mountUploadCoverImageMiddleware(knexSql), 
        (req: Request, res: Response) => {
            res.status(200).json({ message: "Cover image uploaded successfully." });
    
    });
    router.post("/upload/user_icon",
        mountUploadUserIconMiddleware(knexSql),
        (req: Request, res: Response) => {
            res.status(200).json({ message: "User icon uploaded successfully." });
    });

    return router;
};