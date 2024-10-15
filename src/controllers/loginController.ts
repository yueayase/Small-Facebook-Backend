import { Request, Response } from "express";
import { Knex } from "knex";
import retrieveCoverImage from "../utils/retrieveCoverImage";
import retrieveUserIcon from "../utils/retrieveUserIcon";

const jwt = require("jsonwebtoken");

export const mountLoginRouter = (knexSql: Knex) => {
    const loginController = async(req: Request, res: Response) =>  {
        const { cellPhoneOrEmailText, password: userInputPassword } = req.body;
        let userInfo; // for user information stored in the database

        try{
            const isCellPhoneNumber = /^(\+\d{1,3}[- ]?)?\d{10}$/.test(cellPhoneOrEmailText);
            if (isCellPhoneNumber) {
                const userCellPhone = await knexSql
                    .select("userId", "cellPhoneNumber")
                    .from("UserCellPhone")
                    .where({ cellPhoneNumber: cellPhoneOrEmailText });
                
                // the cellphone number has not been registered
                if (userCellPhone.length === 0) {
                    res.status(404).json({ error: `can't find cellphone number: ${cellPhoneOrEmailText}!` });
                    return;
                }

                userInfo = await knexSql
                    .select("id", "name", "password", "url", "genderAlias", "coverImage", "userIcon")
                    .from("User")
                    .join("UserUrl", "User.id", "=", "UserUrl.userId")
                    .join("UserCellPhone", "User.id", "=", "UserCellPhone.userId")
                    .where("User.id", userCellPhone[0].userId);
            }
            else {
                const userEmail = await knexSql
                    .select("userId", "email")
                    .from("UserEmail")
                    .where({ email: cellPhoneOrEmailText });
                
                // the email has not been registered
                if (userEmail.length === 0) {
                    res.status(404).json({ message: `can't find email: ${cellPhoneOrEmailText}!` });
                    return;
                }

                userInfo = await knexSql
                    .select("id", "name", "password", "url", "genderAlias", "coverImage", "userIcon")
                    .from("User")
                    .join("UserUrl", "User.id", "=", "UserUrl.userId")
                    .join("UserEmail", "User.id", "=","UserEmail.userId")
                    .where("User.id", userEmail[0].userId);
            }
            
            // inconsistent password
            if (userInfo[0].password !== userInputPassword) {
                res.status(401).json({ message: "Invalid password!"});
                return;
            }

            // generate JWT token
            const token = jwt.sign(
                { userId: userInfo[0].id}, 
                process.env.jwt_token_secret,
                { 
                    algorithm: "HS256",
                    expiresIn: "24h" // 24 hours
                }
            );

            const { password, ...toSendInfo } = userInfo[0]; // split out password
            const { coverImage, userIcon, genderAlias, url } = toSendInfo;
            toSendInfo["coverImage"] = retrieveCoverImage(coverImage, url);
            toSendInfo["userIcon"] = retrieveUserIcon(userIcon, genderAlias, url);
            
            // send all of the user information
            res.status(200).json({ ...toSendInfo, accessToken: token });
        }
        catch(error) {
            res.status(500).json({ error: error });
        }
    };

    return loginController;
}