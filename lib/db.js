const { Pool } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });

// Skapa en pool av databasanslutningar
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

async function query(text, params) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

// Hjälpfunktion för att skapa tabeller
async function initDatabase() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        image_url TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

module.exports = {
  query,
  initDatabase,
};
