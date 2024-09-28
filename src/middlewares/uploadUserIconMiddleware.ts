import { Request, Response } from "express";
import { Knex } from "knex";
import path from "path";
import fs from 'fs';
import multer, { FileFilterCallback } from "multer";
import { IncomingMessage } from "http"; // Required for typing req in multer

// Extend multer's File type definition
interface MulterRequest extends Request {
    file: Express.Multer.File;
}

// Adjust the base directory to point to the root of your project
const baseDir = path.resolve(__dirname, '../Users');

export const mountUploadUserIconMiddleware = (knexSql: Knex) => {
    const storage = multer.diskStorage({
        destination: (
            req: Request, 
            file: Express.Multer.File, 
            cb: (error: Error | null, destination: string) => void
        ) => {
            const userUrl = req.body.userUrl;
            const user_dir = path.join(baseDir, userUrl, "photo");
            cb(null, user_dir);
        },
        filename: (
            req: Request, 
            file: Express.Multer.File, 
            cb: (error: Error | null, filename: string) => void
        ) => {
            cb(null, `${Date.now()}_${file.originalname}`);
        } 
    });

    const upload = multer({ storage: storage }).single("user_icon");

    const uploadUserIconMiddleware = async (req: Request, res: Response) => {
        upload(req, res, async (error: any) => {
            if (error)
                return res.status(500).json({ error: `uploading user icon failed due to ${error}` });

            try {
                const userUrl = req.body.userUrl;
                const filename = req.file?.filename;

                if (!filename || filename.length === 0)
                    return res.status(400).json({ error: "you didn't upload the user icon." });

                console.log("test upload user icon file");

                await knexSql.transaction(async (trx: Knex.Transaction) => {
                    await trx("User")
                        .update({ userIcon: filename })
                        .where({
                            id: trx.select("userId")
                               .from("UserUrl")
                               .where("url", userUrl)
                        }
                    );

                    return res.status(200).json({ message: `successfully upload the user icon.` });
                });
            }
            catch (dbError) {
                const userUrl  = req.body.userUrl;
                const filename = req.file?.filename;

                if (filename && filename.length > 0) {
                    const user_dir = path.join(__dirname, "Users", userUrl, "photo", filename);
                    fs.unlink(user_dir, (fsError) => {
                        if (fsError)
                            console.log(`failed to delete the file ${filename} due to ${fsError}.`);
                        else
                            console.log(`successfully delete the file ${filename}.`);
                    });
                }
                return res.status(500).json({ error: `database update failed due to ${dbError}` });
            }
        });
    };

    return uploadUserIconMiddleware;
};