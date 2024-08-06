import { Request, Response, Router } from "express";
import { Knex } from "knex";

export const mountSignupRouter = (knexSql: Knex) => {
    const signupController = async (req: Request, res: Response) => {
        const { name, EmailOrCellPhoneNumber, password, birthday, gender, genderAlias } = req.body;
        console.log("test...");
        console.log(name);
        console.log(EmailOrCellPhoneNumber);
        console.log(password);
        console.log(birthday);
        console.log(gender);
        console.log(genderAlias);
        try {
            const isCellPhoneNumber = /^(\+\d{1,3}[- ]?)?\d{10}$/.test(EmailOrCellPhoneNumber);
           
            const trx = await knexSql.transaction(async (trx: Knex.Transaction) => {
                await trx("User").insert({ 
                    name: name, 
                    email: isCellPhoneNumber ? null : EmailOrCellPhoneNumber, 
                    cellPhoneNumber: isCellPhoneNumber ? EmailOrCellPhoneNumber : null,
                    password: password,
                    birthday: birthday,
                    gender: gender,
                    genderAlias: genderAlias  
                });
            });

            res.status(200).json({ message: `successfully insert user ${name}`});

        }
        catch(error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    };

    return signupController;
}