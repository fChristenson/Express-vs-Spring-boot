module.exports = (req, res, next) => {
  const { userId } = req.session;
  if (!userId) return res.redirect("/login");
  return next();
};
