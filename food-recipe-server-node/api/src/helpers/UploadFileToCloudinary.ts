import { v4 as uuid } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs/promises";
export const UploadFileToCloudinary = async (file: File) => {
  const imageProperty = file.name.split(".");
  const path = `${process.env.TEMP_IMAGE_PATH}/${imageProperty[0]}${uuid()}.${
    imageProperty[1]
  }`;
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path, buffer);
    const response = await cloudinary.uploader.upload(path);
    return response.secure_url;
  } catch (error) {
    console.log(error);
    return "";
  } finally {
    await fs.unlink(path);
  }
};
