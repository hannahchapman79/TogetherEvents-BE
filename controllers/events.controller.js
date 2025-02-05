const { selectEvents, selectEventById } = require("../models/events.model");

exports.getEvents = (request, response, next) => {
  selectEvents()
    .then((events) => {
      response.status(200).send({ events });
    })
    .catch(next);
};

exports.getEventById = (request, response, next) => {
  const { id } = request.params;
  selectEventById(id)
    .then((event) => {
      response.status(200).send(event);
    })
    .catch(next);
};
