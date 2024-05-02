// Middleware for handling 404 Not Found errors
const notFound = (req, res, next) => {
  // Create a new Error object with a descriptive message including the requested URL
  const error = new Error(`Not Found - ${req.originalUrl}`);
  // Set the status code of the response to 404 Not Found
  res.status(404);
  // Call the next middleware with the error
  next(error);
};

// Middleware for handling errors
const errorHandler = (err, req, res, next) => {
  // Determine the status code based on the response's status code or default to 500 Internal Server Error
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  // Set the status code of the response
  res.status(statusCode);
  // Send a JSON response with the error message and stack trace (in development mode)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

// Exporting the middleware functions
module.exports = { notFound, errorHandler };
