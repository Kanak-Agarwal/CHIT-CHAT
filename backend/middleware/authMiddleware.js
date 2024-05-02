// Importing the jsonwebtoken package for handling JSON Web Tokens (JWT)
const jwt = require("jsonwebtoken");
// Importing the User model
const User = require("../models/userModel.js");
// Importing the express-async-handler middleware to handle asynchronous functions in Express
const asyncHandler = require("express-async-handler");

// Middleware to protect routes requiring authentication
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if the request contains an Authorization header with a Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract the token from the Authorization header
      token = req.headers.authorization.split(" ")[1];

      // Verify the token and decode its payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user associated with the decoded token's ID and exclude the password field
      req.user = await User.findById(decoded.id).select("-password");

      // Call the next middleware
      next();
    } catch (error) {
      // If there's an error in token verification, send a 401 Unauthorized response
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  // If no token is found in the Authorization header, send a 401 Unauthorized response
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// Exporting the protect middleware
module.exports = { protect };
