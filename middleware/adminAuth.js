function verifyAdmin(request, response, next) {
    if (!request.user.isAdmin) { 
      return response.status(403).json({ message: "Access denied: Admins only" });
    }
    next();
  }

module.exports = verifyAdmin;
