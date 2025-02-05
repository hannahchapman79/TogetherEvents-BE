const express = require("express");
const {
  getEvents,
  getEventById,
  postEvents,
  updateEventById,
} = require("../controllers/events.controller");
const verifyToken = require("../middleware/jwtAuth");
const verifyAdmin = require("../middleware/adminAuth");

const eventsRouter = express.Router();

eventsRouter
  .route("/")
  .get(getEvents)
  .post(verifyToken, verifyAdmin, postEvents);
eventsRouter
  .route("/:id")
  .get(getEventById)
  .patch(verifyToken, verifyAdmin, updateEventById);

module.exports = eventsRouter;
