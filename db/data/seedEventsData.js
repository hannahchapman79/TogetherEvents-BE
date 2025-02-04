const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Event } = require("../../models/events.model.js");
const { User } = require("../../models/users.model.js");
const connectMongoDB = require("../../db/mongodbConnection");
const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: envFile });

async function seedDatabase() {
  try {
    await connectMongoDB();

    let admin = await User.findOne({ email: "admin@example.com" });
    if (!admin) {
      admin = await User.create({
        username: "admin01",
        name: "Admin User",
        password: "Password123",
        email: "admin@example.com",
        isAdmin: true,
      });
      console.log("Admin user created");
    } else {
      console.log("Admin user already exists");
    }

    const existingEventsCount = await Event.countDocuments();
    if (existingEventsCount > 0) {
      console.log("Events already exist, skipping seeding");
      return;
    }

    const events = [
      {
        title: "Creative Writing Workshop",
        description:
          "Open session for aspiring writers to share and improve their work",
        startDate: new Date("2025-06-06T18:00:00Z"),
        endDate: new Date("2025-06-06T20:00:00Z"),
        location: {
          type: "physical",
        },
        organiser: admin._id,
        maxAttendees: 25,
        category: "Arts & Creativity",
        status: "published",
      },
      {
        title: "Book Club: Monthly Meeting",
        description:
          "This month we're discussing 'The Alchemist' by Paulo Coelho. New members welcome! Light refreshments provided.",
        startDate: new Date("2025-06-08T18:30:00Z"),
        endDate: new Date("2025-06-08T20:30:00Z"),
        location: {
          type: "hybrid",
        },
        organiser: admin._id,
        maxAttendees: 20,
        category: "Book Club",
        status: "published",
      },
      {
        title: "Sunday Brunch & Networking",
        description:
          "A relaxed brunch meetup for professionals, entrepreneurs, and creatives to connect.",
        startDate: new Date("2025-06-15T11:00:00"),
        endDate: new Date("2025-06-15T13:00:00"),
        location: {
          type: "physical",
        },
        organiser: admin._id,
        maxAttendees: 15,
        category: "Networking",
        status: "published",
      },
      {
        title: "Pub Quiz Night: Pop Culture Edition",
        description:
          "Test your knowledge of movies, TV shows, and music at our fun trivia night. Teams of up to 4.",
        startDate: new Date("2025-06-10T19:00:00Z"),
        endDate: new Date("2025-06-10T22:00:00Z"),
        location: {
          type: "physical",
        },
        organiser: admin._id,
        category: "Entertainment",
        status: "published",
      },
      {
        title: "Intro to Coding: JavaScript Basics",
        description:
          "Beginner-friendly workshop covering JavaScript fundamentals.",
        startDate: new Date("2025-06-07T10:00:00Z"),
        endDate: new Date("2025-06-07T12:00:00Z"),
        location: {
          type: "physical",
        },
        organiser: admin._id,
        maxAttendees: 20,
        category: "Education",
        status: "published",
      },
      {
        title: "Book Club: Monthly Meeting",
        description:
          "This month we're discussing 'The Midnight Library' by Matt Haig. New members welcome! Light refreshments provided.",
        startDate: new Date("2025-07-08T18:30:00Z"),
        endDate: new Date("2025-07-08T20:30:00Z"),
        location: {
          type: "hybrid",
        },
        organiser: admin._id,
        maxAttendees: 20,
        category: "Book Club",
        status: "published",
      },
      {
        title: "Photography Walk: Nature Edition",
        description:
          "Explore the local nature through your lens and improve your photography skills.",
        startDate: new Date("2025-06-01T11:00:00Z"),
        endDate: new Date("2025-06-01T14:00:00Z"),
        location: {
          type: "physical",
        },
        organiser: admin._id,
        maxAttendees: 20,
        category: "Arts & Creativity",
        status: "published",
      },
      {
        title: "Mental Health Awareness Talk",
        description:
          "A discussion on mindfulness, stress management, and self-care.",
        startDate: new Date("2025-06-01T10:00:00Z"),
        endDate: new Date("2025-06-01T11:30:00Z"),
        location: {
          type: "online",
        },
        organiser: admin._id,
        category: "Health & Wellness",
        status: "published",
      },
      {
        title: "Startup & Small Business Meetup",
        description:
          "Connect with fellow entrepreneurs and discuss business strategies.",
        startDate: new Date("2025-07-05T10:00:00Z"),
        endDate: new Date("2025-07-05T12:00:00Z"),
        location: {
          type: "online",
        },
        organiser: admin._id,
        category: "Networking",
        status: "published",
      },
      {
        title: "Hiking & Nature Walk",
        description:
          "Guided 4km hike through scenic trails with fellow nature lovers.",
        startDate: new Date("2025-07-06T10:00:00Z"),
        endDate: new Date("2025-07-06T16:00:00Z"),
        location: {
          type: "physical",
        },
        organiser: admin._id,
        maxAttendees: 12,
        category: "Outdoors & Adventure",
        status: "published",
      },
      {
        title: "Personal Finance 101",
        description:
          "Learn about budgeting, saving, and investing in this beginner-friendly workshop.",
        startDate: new Date("2025-06-02T19:00:00Z"),
        endDate: new Date("2025-06-02T20:30:00Z"),
        location: {
          type: "online",
        },
        organiser: admin._id,
        category: "Education",
        status: "published",
      },
      {
        title: "Community Hatha Yoga & Breathwork",
        description:
          "Join us for a 90 minute Hatha Yoga & Breathwork session to refresh your mind and body. Free session but small donations welcome.",
        startDate: new Date("2025-06-06T17:00:00Z"),
        endDate: new Date("2025-06-06T18:30:00Z"),
        location: {
          type: "physical",
        },
        organiser: admin._id,
        maxAttendees: 18,
        category: "Health & Wellness",
        status: "published",
      },
    ];

    await Event.insertMany(events);
    console.log("Events seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();
