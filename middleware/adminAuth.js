const { User } = require("../models/users.model");

async function verifyAdmin(request, response, next) {

  const user = await User.findOne({ email: request.user.email }); // Fetch user from DB

  if (!user?.isAdmin) {
    return response.status(403).json({ message: "Access denied: Admins only" });
  }

  next();
}

module.exports = verifyAdmin;