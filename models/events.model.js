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
    if (Array.isArray(newEvent)) {
      const addedEvents = await Event.insertMany(newEvent);
      return addedEvents;
    } else {
      const addedEvent = await Event.create(newEvent);
      return addedEvent;
    }
  } catch (error) {
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

module.exports = {
  Event,
  selectEvents,
  selectEventById,
  insertEvents,
  editEventById,
};
