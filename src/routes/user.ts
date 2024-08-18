import { Router } from "express";
import { Knex } from "knex";
import { mountSignupRouter } from "../controllers/signupController";
import { mountLoginRouter } from "../controllers/loginController";

export const mountUserRouter = (knexSql: Knex) => {
    let router = Router();

    router.post("/signup", mountSignupRouter(knexSql));
    router.post("/login", mountLoginRouter(knexSql));

    return router;
};