import mongoose from "mongoose";

class Database {
  private static instance: Database;

  private constructor() { }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();

      mongoose
        .connect(process.env.MONGO_URL!)
        .then(() => console.log("Database connected"))
        .catch((err) => console.error("DB connection error:", err));
    }

    return Database.instance;
  }
}

export default Database;
