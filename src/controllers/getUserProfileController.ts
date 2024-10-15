import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { Knex } from "knex";
import retrieveCoverImage from "../utils/retrieveCoverImage";
import retrieveUserIcon from "../utils/retrieveUserIcon";

export const mountGetUserProfileController = (knexSql: Knex) => {
    const getUserProfileController = async(req: Request, res: Response) => {
        const { userId } = req.params;

        try{
            const userProfileData = await knexSql
            .select("name", "genderAlias", "coverImage", "userIcon", "url")
            .from("User")
            .join("UserUrl", "User.id", "=", "UserUrl.userId")
            .where("User.id", userId);
        
            if (userProfileData.length === 0) {
                res.status(404).json({ message: "can't find the user name." });
                return;
            }

            const {name, genderAlias, coverImage, userIcon, url} = userProfileData[0];
            let toSendUserData: { [key: string] : any } = {name: name};

            toSendUserData["coverImage"] = retrieveCoverImage(coverImage, url);
            toSendUserData["userIcon"] = retrieveUserIcon(userIcon, genderAlias, url)

            return res.status(200).json(toSendUserData);
        }
        catch(error) {
            return res.status(500).json({ error: error });
        }
    };

    return getUserProfileController;
};

