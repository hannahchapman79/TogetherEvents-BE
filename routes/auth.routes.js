const { postUser } = require("../controllers/auth.controller");
const express = require("express");

const authRouter = express.Router();

authRouter.route("/signup").post(postUser);

module.exports = authRouter;
