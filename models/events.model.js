const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
      },
      description: {
        type: String,
        required: true
      },
      image: {
        type: String,
      },
      startDate: {
        type: Date,
        required: true
      },
      endDate: {
        type: Date,
      },
      location: {
        type: {
          type: String,
          enum: ['physical', 'online', 'hybrid'],
          required: true
        },
        address: String,
        onlineLink: String,
      },
      organiser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }],
      status: {
        type: String,
        enum: ['draft', 'published', 'cancelled', 'completed'],
        default: 'published'
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
        default: Date.now
      }
})

const Event = mongoose.model("Event", eventSchema);

module.exports = { Event }