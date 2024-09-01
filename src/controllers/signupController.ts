import { Request, Response } from "express";
import { Knex } from "knex";

export const mountSignupRouter = (knexSql: Knex) => {
    const signupController = async (req: Request, res: Response) => {
        const { name, EmailOrCellPhoneNumber, password, birthday, gender, genderAlias } = req.body;
        try {
            const isCellPhoneNumber = /^(\+\d{1,3}[- ]?)?\d{10}$/.test(EmailOrCellPhoneNumber);
           
            const trx = await knexSql.transaction(async (trx: Knex.Transaction) => {
                const [userId] = await trx("User").insert({ 
                    name: name, 
                    password: password,
                    birthday: birthday,
                    gender: gender,
                    genderAlias: genderAlias  
                });

                if (isCellPhoneNumber){
                    await trx("UserCellPhone").insert({
                        userId: userId,
                        cellPhoneNumber: EmailOrCellPhoneNumber
                    });
                }
                else{
                    await trx("UserEmail").insert({
                        userId: userId,
                        email: EmailOrCellPhoneNumber
                    });
                }
                
                // generate the url for your profile page
                let your_url = name.replace(/\s+/g, ".");
                const [exist_username] = await trx
                    .select("amount")
                    .from("ExistUsername")
                    .where({ username: your_url });
                
                if (!exist_username) {
                    await trx("ExistUsername").insert({
                        username: your_url,
                        amount: 1
                    });
                }
                else {
                    const current_amount = exist_username.amount + 1;
                    await trx("ExistUsername")
                        .update({ amount: current_amount})
                        .where({ username: your_url });
                    
                    your_url = `${your_url}.${current_amount}`;
                }

                await trx("UserUrl").insert({ userId: userId, url: your_url });
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