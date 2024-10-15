import path from "path";
import fs from "fs";

const retrieveCoverImage = (coverImage: string, url: string) => {
    if (coverImage.length === 0)
        return '';

    const baseDir = path.resolve(__dirname, '../Users');
    const imagePath = path.join(baseDir, url, "photo", coverImage);
    const image = fs.readFileSync(imagePath, { encoding: "base64" }); 

    return `data:image/jpeg;base64,${image}`;
};

export default retrieveCoverImage;