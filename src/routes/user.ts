import { Router } from "express";
import { Knex } from "knex";
import { mountSignupRouter } from "../controllers/signupController";

export const mountUserRouter = (knexSql: Knex) => {
    let router = Router();

    router.post("/signup", mountSignupRouter(knexSql));

    return router;
};