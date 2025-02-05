const express = require("express");
const {
  getEvents,
  getEventById,
  postEvents,
} = require("../controllers/events.controller");
const verifyToken = require("../middleware/jwtAuth");
const verifyAdmin = require("../middleware/adminAuth")

const eventsRouter = express.Router();

eventsRouter.route("/").get(getEvents).post(verifyToken, verifyAdmin, postEvents);
eventsRouter.route("/:id").get(getEventById);

module.exports = eventsRouter;