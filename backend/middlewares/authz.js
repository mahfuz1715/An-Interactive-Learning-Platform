// middlewares/authz.js
module.exports.requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).send({ message: "Admin only" });
  }
  next();
};
