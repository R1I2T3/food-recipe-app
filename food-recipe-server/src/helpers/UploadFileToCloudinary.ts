import { v4 as uuid } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import { unlink } from "node:fs/promises";
export const UploadFileToCloudinary = async (file: File) => {
  const imageProperty = file.name.split(".");
  const path = `${process.env.TEMP_IMAGE_PATH}/${imageProperty[0]}${uuid()}.${
    imageProperty[1]
  }`;
  try {
    const buffer = await file.arrayBuffer();
    await Bun.write(path, buffer);
    const response = await cloudinary.uploader.upload(path);
    return response.secure_url;
  } catch (error) {
    console.log(error);
    return "";
  } finally {
    await unlink(path);
  }
};
