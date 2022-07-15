const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json("No estás autorizado");
};

const isAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.role === "admin") {
      return next();
    }
  }
  return res.status(401).json("Necesitas ser admin");
};

module.exports = {
  isAuthenticated,
  isAdmin,
};
