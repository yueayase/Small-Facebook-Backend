import { Request, Response } from "express";
import { Knex } from "knex";

export const mountSignupRouter = (knexSql: Knex) => {
    const signupController = async (req: Request, res: Response) => {
        const { name, EmailOrCellPhoneNumber, password, birthday, gender, genderAlias } = req.body;
        try {
            const isCellPhoneNumber = /^(\+\d{1,3}[- ]?)?\d{10}$/.test(EmailOrCellPhoneNumber);
           
            const trx = await knexSql.transaction(async (trx: Knex.Transaction) => {
                await trx("User").insert({ 
                    name: name, 
                    password: password,
                    birthday: birthday,
                    gender: gender,
                    genderAlias: genderAlias  
                }).then(
                    async(row) => {
                        const userId = row[0];  // See https://stackoverflow.com/questions/43465266/knex-does-not-return-insert-id
                        if (isCellPhoneNumber){
                            await trx("UserCellPhone").insert({
                                userId: userId,
                                cellPhoneNumber: EmailOrCellPhoneNumber
                            });
                        }else{
                            await trx("UserEmail").insert({
                                userId: userId,
                                email: EmailOrCellPhoneNumber
                            });
                        }
                        //console.log(row);
                    }
                );
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