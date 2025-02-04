const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/users.model");

const checkUserExists = async (username, email) => {
  const existingUsername = await User.findOne({ username });
  const existingEmail = await User.findOne({ email });

  return {
    username: !!existingUsername,
    email: !!existingEmail,
  };
};

exports.insertUser = async (newUser) => {
  if (
    !newUser.username ||
    !newUser.name ||
    !newUser.password ||
    !newUser.email
  ) {
    throw {
      status: 400,
      message: "All fields are required (name, username, password and email)",
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(newUser.email)) {
    throw { status: 400, message: "Invalid email format" };
  }

  if (newUser.password.length < 8) {
    throw {
      status: 400,
      message: "Password must be at least 8 characters long",
    };
  }

  const conflicts = await checkUserExists(newUser.username, newUser.email);
  if (conflicts.username && conflicts.email) {
    throw { status: 400, message: "User already exists" };
  } else if (conflicts.username) {
    throw { status: 400, message: "Username already exists" };
  } else if (conflicts.email) {
    throw { status: 400, message: "Email already exists" };
  }

  const hashedPassword = await bcrypt.hash(newUser.password, 13);
  const user = new User({
    username: newUser.username,
    name: newUser.name,
    password: hashedPassword,
    email: newUser.email,
    isAdmin: newUser.isAdmin,
  });

  const savedUser = await user.save();
  return {
    user_id: savedUser._id,
    username: savedUser.username,
    email: savedUser.email,
    isAdmin: newUser.isAdmin,
  };
};

exports.attemptLogin = async (loginAttempt) => {
  if (!loginAttempt.email || !loginAttempt.password) {
    throw { status: 400, message: "All fields are required (email, password)" };
  }

  const user = await User.findOne({ email: loginAttempt.email });
  if (!user) {
    throw { status: 400, message: "Bad email or password" };
  }

  const isMatch = await bcrypt.compare(loginAttempt.password, user.password);
  if (!isMatch) {
    throw { status: 400, message: "Bad email or password" };
  }

  const accessToken = jwt.sign(
    { user_id: user._id, email: user.email, isAdmin: user.isAdmin },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15min" },
  );

  const refreshToken = jwt.sign(
    { email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "30d" },
  );

  return {
    user: {
      user_id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    accessToken,
    refreshToken,
  };
};
