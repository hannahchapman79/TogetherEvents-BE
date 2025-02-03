const { insertUser } = require("../models/auth.model");

exports.postUser = async (request, response, next) => {
  try {
    const user = request.body;
    const newUser = await insertUser(user);
    response.status(201).send({ user: newUser });
  } catch (error) {
    next(error);
  }
};
