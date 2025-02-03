const { insertUser, attemptLogin } = require("../models/auth.model");

exports.postUser = async (request, response, next) => {
    try {
        const user = request.body;
        const newUser = await insertUser(user);
        response.status(201).send({ user: newUser });
    } catch (error) {
        next(error);
    }
};

exports.postLoginAttempt = async (request, response, next) => {
    try {
        const loginAttempt = request.body;
        const { user, accessToken, refreshToken } = await attemptLogin(loginAttempt);

        response.cookie("jwt", refreshToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        response.status(200).json({ user, accessToken });
    } catch (error) {
        next(error)
    }
};