const {
  postUser,
  postLoginAttempt,
  postRefreshToken,
} = require("../controllers/auth.controller");
const express = require("express");

const authRouter = express.Router();

authRouter.route("/signup").post(postUser);
authRouter.route("/login").post(postLoginAttempt);
authRouter.route("/refresh").post(postRefreshToken);

module.exports = authRouter;
