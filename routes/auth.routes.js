const {
  postUser,
  postLoginAttempt,
  postRefreshToken,
  getCurrentUser,
  postLogout
} = require("../controllers/auth.controller");
const verifyToken = require("../middleware/jwtAuth");
const express = require("express");

const authRouter = express.Router();

authRouter.route("/signup").post(postUser);
authRouter.route("/login").post(postLoginAttempt);
authRouter.route("/refresh").post(postRefreshToken);
authRouter.route("/me").get(verifyToken, getCurrentUser);
authRouter.route("/logout").post(postLogout); 

module.exports = authRouter;
