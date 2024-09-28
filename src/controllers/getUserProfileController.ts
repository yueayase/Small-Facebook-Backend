import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { Knex } from "knex";

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

            if (coverImage.length === 0) {
                toSendUserData["coverImage"] = '';
            }
            else {
                const baseDir = path.resolve(__dirname, '../Users');
                const imagePath = path.join(baseDir, url, "photo", coverImage);
                const image = fs.readFileSync(imagePath, { encoding: "base64" }); 
                toSendUserData["coverImage"] = `data:image/jpeg;base64,${image}`;
            }

            if (userIcon.length === 0) {
                const baseDir = path.resolve(__dirname, '../DefaultUserIcons');
                let imageName = "";
                if (genderAlias === "1")
                    imageName = "anonymous_avatars_grey_circles_female1.jpg";
                else if (genderAlias === "2")
                    imageName = "anonymous_avatars_grey_circles_male1.jpg";
                else
                    imageName = "anonymous_avatars_grey_circles_female2";

                const imagePath = path.join(baseDir, imageName);
                const image = fs.readFileSync(imagePath, { encoding: "base64" });
                toSendUserData["userIcon"] = `data:image/jpeg;base64,${image}`;
            }
            else {
                const baseDir = path.resolve(__dirname, '../Users');
                const imagePath = path.join(baseDir, url, "photo", userIcon);
                const image = fs.readFileSync(imagePath, { encoding: "base64" }); 
                toSendUserData["userIcon"] = `data:image/jpeg;base64,${image}`;
            }

            return res.status(200).json(toSendUserData);
        }
        catch(error) {
            return res.status(500).json({ error: error });
        }
    };

    return getUserProfileController;
};

