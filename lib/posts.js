import { query } from "./db";

export async function getPosts() {
  try {
    const result = await query("SELECT * FROM posts ORDER BY created_at DESC");
    return result.rows.map((post) => ({
      ...post,
      image: post.image_url,
      userFirstName: "Max", // Temporärt hårdkodat namn
    }));
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}

export async function storePost(post) {
  try {
    const result = await query(
      "INSERT INTO posts (title, content, image_url, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [post.title, post.content, post.imageUrl, post.userId]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error storing post:", error);
    throw error;
  }
}

export async function updatePostLikeStatus(postId, userId) {
  try {
    // Här kan vi lägga till like-funktionalitet senare
    // För nu returnerar vi bara posten
    const result = await query("SELECT * FROM posts WHERE id = $1", [postId]);
    return result.rows[0];
  } catch (error) {
    console.error("Error updating post like status:", error);
    throw error;
  }
}
