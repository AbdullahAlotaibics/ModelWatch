const errorHandler = (err, req, res, _next) => {
  const status = err.status || 500;
  const message = err.message || "Internal server error";
  res.status(status).json({ message, error: err.stack ? err.stack.split("\n")[0] : undefined });
};

module.exports = errorHandler;
