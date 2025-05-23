const { v2: cloudinary } = require("cloudinary");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });

console.log("Cloudinary Config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY
    ? "API Key is set"
    : "API Key is missing",
  api_secret: process.env.CLOUDINARY_API_SECRET
    ? "API Secret is set"
    : "API Secret is missing",
});

if (!process.env.CLOUDINARY_CLOUD_NAME) {
  throw new Error("CLOUDINARY_CLOUD_NAME is not set");
}

if (!process.env.CLOUDINARY_API_KEY) {
  throw new Error("CLOUDINARY_API_KEY is not set");
}

if (!process.env.CLOUDINARY_API_SECRET) {
  throw new Error("CLOUDINARY_API_SECRET is not set");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(image) {
  try {
    console.log("Starting image upload...");
    console.log("Image type:", image.type);
    console.log("Image size:", image.size);

    const imageData = await image.arrayBuffer();
    const mime = image.type;
    const encoding = "base64";
    const base64Data = Buffer.from(imageData).toString("base64");
    const fileUri = "data:" + mime + ";" + encoding + "," + base64Data;

    console.log("Uploading to Cloudinary...");
    const result = await cloudinary.uploader.upload(fileUri, {
      folder: "nextjs-course-mutations",
    });

    console.log("Upload successful:", result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error("Error in uploadImage:", error);
    throw error;
  }
}

module.exports = {
  uploadImage,
};
