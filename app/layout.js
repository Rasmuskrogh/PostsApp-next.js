import Header from "@/components/header";
import "./globals.css";
import { initDatabase } from "@/lib/db";

// Initiera databasen när appen startar
if (process.env.NODE_ENV === "development") {
  initDatabase().catch(console.error);
}

export const metadata = {
  title: "NextPosts",
  description: "Browse and share amazing posts.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
