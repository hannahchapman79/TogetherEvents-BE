const { selectEvents } = require("../models/events.model");

exports.getEvents = (request, response, next) => {
    selectEvents()
    .then((events) => {
        response.status(200).send({ events })
    })
    .catch(next);
}