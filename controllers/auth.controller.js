const { insertUser, attemptLogin } = require("../models/auth.model");
const jwt = require("jsonwebtoken");

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
    const { user, accessToken, refreshToken } =
      await attemptLogin(loginAttempt);

    response.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    response.status(200).json({ user, accessToken });
  } catch (error) {
    next(error);
  }
};

exports.postRefreshToken = (request, response, next) => {
  try {
    const refreshToken = request.cookies?.jwt;
    if (!refreshToken) {
      return response
        .status(401)
        .json({ message: "No refresh token provided" });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (error, decoded) => {
        if (error) {
          return response
            .status(403)
            .json({ message: "Invalid or expired refresh token" });
        }

        const newAccessToken = jwt.sign(
          {
            user_id: decoded.user_id,
            email: decoded.email,
            isAdmin: decoded.isAdmin,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15min" },
        );

        response.json({ accessToken: newAccessToken });
      },
    );
  } catch (error) {
    console.log(error)
    next(error);
  }
};

exports.getCurrentUser = (request, response, next) => {
  response.json({ user: request.user });
};

exports.postLogout = (request, response, next) => {
  try {
    response.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'None',
      secure: true
    });

    response.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};