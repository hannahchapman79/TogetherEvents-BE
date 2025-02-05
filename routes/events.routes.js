const express = require("express");
const { getEvents, getEventById } = require("../controllers/events.controller");

const eventsRouter = express.Router();

eventsRouter.route("/").get(getEvents);
eventsRouter.route("/:id").get(getEventById);

module.exports = eventsRouter;