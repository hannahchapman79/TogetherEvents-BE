const express = require("express");
const { getEvents } = require("../controllers/events.controller");

const eventsRouter = express.Router();

eventsRouter.route("/").get(getEvents);

module.exports = eventsRouter;