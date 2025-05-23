const { query } = require("../lib/db.js");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });

async function setupDatabase() {
  try {
    console.log("Attempting to connect to database...");
    console.log("Current directory:", __dirname);
    console.log("Env file path:", path.resolve(__dirname, "../.env.local"));
    console.log("Database URL:", process.env.DATABASE_URL);

    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set in environment variables");
    }

    // Skapa users tabell
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Skapa posts tabell
    await query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        image_url TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Skapa likes tabell
    await query(`
      CREATE TABLE IF NOT EXISTS likes (
        user_id INTEGER NOT NULL,
        post_id INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, post_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
      );
    `);

    // Lägg till testanvändare om de inte redan finns
    const userCount = await query("SELECT COUNT(*) FROM users");
    if (userCount.rows[0].count === "0") {
      await query(`
        INSERT INTO users (first_name, last_name, email)
        VALUES 
          ('John', 'Doe', 'john@example.com'),
          ('Max', 'Schwarz', 'max@example.com')
        ON CONFLICT (email) DO NOTHING;
      `);
    }

    console.log("Database setup completed successfully!");
  } catch (error) {
    console.error("Error setting up database:", error);
    process.exit(1);
  }
}

// Kör setup
setupDatabase();
