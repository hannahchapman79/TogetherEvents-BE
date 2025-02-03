const { postUser, postLoginAttempt } = require("../controllers/auth.controller");
const express = require("express");

const authRouter = express.Router();

authRouter.route("/signup").post(postUser);
authRouter.route("/login").post(postLoginAttempt)

module.exports = authRouter;
