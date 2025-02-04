const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const app = require("../app");
const { User } = require("../models/users.model");
const bcrypt = require("bcrypt");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await mongoose.connection.dropDatabase();
});

describe("POST /api/auth/signup", () => {
  it("should create a new user with hashed password", async () => {
    const newUser = {
      username: "hannahc",
      name: "Hannah Chapman",
      email: "hannah@example.com",
      password: "securePassword123",
      isAdmin: false,
    };

    const response = await request(app)
      .post("/api/auth/signup")
      .send(newUser)
      .expect(201);

    expect(response.body.user).toHaveProperty("user_id");
    expect(response.body.user).toHaveProperty("email", newUser.email);
    expect(response.body.user).toHaveProperty("username", newUser.username);
    expect(response.body.user).not.toHaveProperty("password");

    const userInDb = await User.findOne({ email: newUser.email });
    expect(userInDb).not.toBeNull();
    expect(userInDb.password).not.toBe(newUser.password);
  });

  it("should return 400 if email is already taken", async () => {
    const existingUser = {
      username: "johndoe",
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password123",
      isAdmin: false,
    };

    await new User({
      ...existingUser,
      password: await require("bcrypt").hash(existingUser.password, 13),
    }).save();

    const response = await request(app)
      .post("/api/auth/signup")
      .send(existingUser)
      .expect(400);

    expect(response.body.message).toBe("User already exists");
  });

  it("should return 400 if password is too short", async () => {
    const invalidUser = {
      username: "janedoe",
      name: "Jane Doe",
      email: "janedoe@example.com",
      password: "123",
      isAdmin: false,
    };

    const response = await request(app)
      .post("/api/auth/signup")
      .send(invalidUser)
      .expect(400);

    expect(response.body.message).toBe(
      "Password must be at least 8 characters long",
    );
  });

  it("should return 400 if email format is invalid", async () => {
    const invalidUser = {
      username: "invalidemail",
      name: "Invalid Email User",
      email: "not-an-email",
      password: "validPassword123",
      isAdmin: false,
    };

    const response = await request(app)
      .post("/api/auth/signup")
      .send(invalidUser)
      .expect(400);

    expect(response.body.message).toBe("Invalid email format");
  });

  it("should return 400 if username is missing", async () => {
    const invalidUser = {
      name: "No Username User",
      email: "user@example.com",
      password: "validPassword123",
      isAdmin: false,
    };

    const response = await request(app)
      .post("/api/auth/signup")
      .send(invalidUser)
      .expect(400);

    expect(response.body.message).toBe(
      "All fields are required (name, username, password and email)",
    );
  });
});

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    const testUser = {
      username: "testuser",
      name: "Test User",
      email: "test@example.com",
      password: await bcrypt.hash("testPassword123", 13),
      isAdmin: false,
    };
    await new User(testUser).save();
  });

  it("should login successfully and return JWT token", async () => {
    const loginCredentials = {
      email: "test@example.com",
      password: "testPassword123",
    };

    const response = await request(app)
      .post("/api/auth/login")
      .send(loginCredentials)
      .expect(200);

    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("email", loginCredentials.email);
    expect(response.body.user).not.toHaveProperty("password");
  });

  it("should return 400 for incorrect password", async () => {
    const loginCredentials = {
      email: "test@example.com",
      password: "wrongPassword",
    };

    const response = await request(app)
      .post("/api/auth/login")
      .send(loginCredentials)
      .expect(400);

    expect(response.body.message).toBe("Bad email or password");
  });

  it("should return 400 for non-existent email", async () => {
    const loginCredentials = {
      email: "nonexistent@example.com",
      password: "testPassword123",
    };

    const response = await request(app)
      .post("/api/auth/login")
      .send(loginCredentials)
      .expect(400);

    expect(response.body.message).toBe("Bad email or password");
  });

  it("should return 400 for missing credentials", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({})
      .expect(400);

    expect(response.body.message).toBe(
      "All fields are required (email, password)",
    );
  });
});
