const bcrypt = require("bcrypt");
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
