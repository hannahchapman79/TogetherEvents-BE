const {
  selectEvents,
  selectEventById,
  insertEvents,
} = require("../models/events.model");

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

exports.postEvents = (request, response, next) => {
  const newEvent = request.body;
  insertEvents(newEvent)
    .then((addedEvents) => {
      response.status(201).send({ events: addedEvents });
    })
    .catch((error) => {
      next(error);
    });
};

exports.updateEventById = (request, response, next) => {
  const { id } = request.params;
  const newAttributes = request.body;
  editEventById(id, newAttributes)
    .then((updatedEvents) => {
      response.status(200).send({ events: updatedEvents });
    })
    .catch((error) => {
      next(error);
    });
};
