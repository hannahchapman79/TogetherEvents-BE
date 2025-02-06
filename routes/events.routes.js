const express = require("express");
const {
  getEvents,
  getEventById,
  postEvents,
  updateEventById,
  deleteEventById,
  signupToEvent,
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
  .patch(verifyToken, verifyAdmin, updateEventById)
  .delete(verifyToken, verifyAdmin, deleteEventById);

eventsRouter.route("/:event_id/signup").post(verifyToken, signupToEvent);

module.exports = eventsRouter;
