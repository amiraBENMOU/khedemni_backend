import cloudinary from "../config/cloudinary";
import fs from "fs/promises";

export async function uploadImage(image, folder) {
  if (!image) return null;
  const uploaded = await cloudinary.uploader.upload(image.tempFilePath, {
    use_filename: true,
    public_id: image.name,
    filename_override: image.name,
    folder,
  });
  await fs.unlink(image.tempFilePath);
  return uploaded;
}

export async function deleteImage(URL, folder) {
  const public_id = URL.split("/").pop().split(".").slice(0, -1).join(".");
  return await cloudinary.uploader.destroy(folder + "/" + public_id);
}

export async function updateImage(image, URL, folder) {
  await deleteImage(URL, folder);
  return await uploadImage(image, folder);
}
