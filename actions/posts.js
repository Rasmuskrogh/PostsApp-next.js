"use server";

import { redirect } from "next/navigation";
import { storePost, updatePostLikeStatus } from "@/lib/posts";
const { uploadImage } = require("@/lib/cloudinary");
import { revalidatePath } from "next/cache";

export async function createPost(prevState, formData) {
  const title = formData.get("title");
  const image = formData.get("image");
  const content = formData.get("content");

  let errors = [];

  if (!title || title.trim().length === 0) {
    errors.push("Title is required");
  }

  if (!content || content.trim().length === 0) {
    errors.push("Content is required");
  }

  if (!image || image.size === 0) {
    errors.push("Image is required");
  }

  if (errors.length > 0) {
    return { errors };
  }

  let imageUrl;
  try {
    console.log("Starting post creation...");
    console.log("Image details:", {
      type: image.type,
      size: image.size,
      name: image.name,
    });

    imageUrl = await uploadImage(image);
    console.log("Image uploaded successfully:", imageUrl);
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error(
      `Image upload failed: ${error.message}. Post was not created. Please try again later.`
    );
  }

  try {
    await storePost({
      imageUrl: imageUrl,
      title,
      content,
      userId: 1,
    });
    console.log("Post stored successfully");
  } catch (error) {
    console.error("Error storing post:", error);
    throw new Error("Failed to store post. Please try again later.");
  }

  revalidatePath("/feed");
  redirect("/feed");
}

export async function togglePostLikeStatus(postId) {
  updatePostLikeStatus(postId, 2);
  revalidatePath("/", "layout");
}
