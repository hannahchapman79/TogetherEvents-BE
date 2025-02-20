const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectMongoDB = require("./db/mongodbConnection");
const { authRouter, eventsRouter } = require("./routes");
const cookieParser = require("cookie-parser");
const { getEndpoints } = require("./controllers/endpoints.controller");

const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: envFile });

const app = express();
// Middleware to parse JSON in request bodies
app.use(express.json());
app.use(cookieParser());
app.use(cors());

const initializeServer = async () => {
  if (process.env.NODE_ENV !== "test") {
    await connectMongoDB();
  }
};

const startServer = async () => {
  try {
    await initializeServer();
    console.log("Server initialized successfully");
    app.listen(9090, () => {
      console.log("Server is running...");
    });
  } catch (error) {
    console.error("Server initialization failed:", error);
    process.exit(1);
  }
};

startServer();

app.get("/api", getEndpoints);
app.use("/api/auth", authRouter);
app.use("/api/events", eventsRouter);

app.use((error, request, response, next) => {
  if (error.name === "CastError" && error.kind === "ObjectId") {
    return response.status(400).send({
      status: 400,
      message: "Invalid ID format",
    });
  }

  if (error.code === 11000) {
    return response.status(409).send({
      status: 409,
      message: "Resource already exists",
    });
  }

  if (error.status && error.message) {
    return response.status(error.status).send({
      status: error.status,
      message: error.message,
    });
  }

  response.status(500).send({
    status: 500,
    message: "Internal server error",
  });
});

app.all("*", (request, response) => {
  response.status(404).send({
    status: 404,
    message: "Path not found",
  });
});

module.exports = app;
