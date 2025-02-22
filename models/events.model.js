const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  location: {
    type: {
      type: String,
      enum: ["physical", "online", "hybrid"],
      required: true,
    },
    address: String,
    onlineLink: String,
  },
  organiser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  attendees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  status: {
    type: String,
    enum: ["draft", "published", "cancelled", "completed"],
    default: "published",
  },
  maxAttendees: {
    type: Number,
  },
  category: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Event = mongoose.model("Event", eventSchema);

const selectEvents = async () => {
  try {
    return await Event.find();
  } catch (error) {
    throw new Error("Could not retrieve events");
  }
};

const selectEventById = async (id) => {
  try {
    const event = await Event.findById(id);
    if (!event) throw new Error("Event not found");
    return event;
  } catch (error) {
    throw new Error("Could not retrieve event");
  }
};

const insertEvents = async (newEvent) => {
  try {
    // Validate and format startDate and endDate
    if (newEvent.startDate) {
      const startDate = new Date(newEvent.startDate);
      if (isNaN(startDate.getTime())) {
        throw new Error("Invalid start date format");
      }
      newEvent.startDate = startDate;
    }

    if (newEvent.endDate) {
      const endDate = new Date(newEvent.endDate);
      if (isNaN(endDate.getTime())) {
        throw new Error("Invalid end date format");
      }
      newEvent.endDate = endDate;
    }

    // Create and save the event
    const addedEvent = await Event.create(newEvent);
    return addedEvent;

  } catch (error) {
    console.error("Error inserting event:", error.message);
    throw new Error("Could not add event(s): " + error.message);
  }
};


const editEventById = async (id, newAttributes) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(id, newAttributes, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) {
      throw new Error("Event not found");
    }

    return updatedEvent;
  } catch (error) {
    throw new Error("Could not update event");
  }
};

const removeEventById = async (id) => {
  const event = await Event.findByIdAndDelete(id);
  if (!event) {
    throw new Error("Event does not exist");
  }
  return event;
};

const registerForEvent = async (userId, eventId) => {
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }
    if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
      throw new Error("Event is full");
    }
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $addToSet: { attendees: userId } },
      { new: true, runValidators: true },
    );
    return updatedEvent;
  } catch (error) {
    throw new Error("Could not sign up for event");
  }
};

module.exports = {
  Event,
  selectEvents,
  selectEventById,
  insertEvents,
  editEventById,
  removeEventById,
  registerForEvent,
};
