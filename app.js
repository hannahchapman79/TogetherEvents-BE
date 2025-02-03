const express = require("express");
const dotenv = require("dotenv");
const connectMongoDB = require("./db/mongodbConnection");

const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: envFile });

const app = express();
// Middleware to parse JSON in request bodies
app.use(express.json());

const initializeServer = async () => {
    if (process.env.NODE_ENV !== "test") {
      await connectMongoDB();
    }
  };

  const startServer = async () => {
    try {
      await initializeServer();
      console.log("Server initialized successfully");
      app.listen(3000, () => {
        console.log("Server is running...");
      });
    } catch (error) {
      console.error('Server initialization failed:', error);
      process.exit(1);
    }
  };
  
  startServer();