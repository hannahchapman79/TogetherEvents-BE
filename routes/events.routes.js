const express = require("express");
const {
  getEvents,
  getEventById,
  postEvents,
} = require("../controllers/events.controller");

const eventsRouter = express.Router();

eventsRouter.route("/").get(getEvents).post(postEvents);
eventsRouter.route("/:id").get(getEventById);

module.exports = eventsRouter;