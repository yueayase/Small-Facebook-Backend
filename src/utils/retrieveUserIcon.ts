import path from "path";
import fs from "fs";

const retrieveUserIcon = (userIcon: string, genderAlias: string, url: string) => {
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
        return `data:image/jpeg;base64,${image}`;
    }
    else {
        const baseDir = path.resolve(__dirname, '../Users');
        const imagePath = path.join(baseDir, url, "photo", userIcon);
        const image = fs.readFileSync(imagePath, { encoding: "base64" }); 
        return `data:image/jpeg;base64,${image}`;
    }
};

export default retrieveUserIcon;