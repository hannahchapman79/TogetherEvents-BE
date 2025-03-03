const {
  selectEvents,
  selectEventById,
  insertEvents,
  removeEventById,
  registerForEvent,
  editEventById,
} = require("../models/events.model");

exports.getEvents = (request, response, next) => {
  const { category } = request.query;
  selectEvents(category)
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

exports.deleteEventById = async (request, response, next) => {
  try {
    const { id } = request.params;
    await removeEventById(id);
    response.status(200).send({ message: "Event successfully deleted" });
  } catch (error) {
    next(error);
  }
};

exports.signupToEvent = (request, response, next) => {
  try {
    const userId = request.user.user_id;
    const { event_id } = request.params;
    registerForEvent(userId, event_id).then((updatedEvent) => {
      response.status(201).send({ registeredEvent: updatedEvent });
    });
  } catch (error) {
    next(error);
  }
};
