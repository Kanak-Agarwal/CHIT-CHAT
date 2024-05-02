const jwt = require("jsonwebtoken");

// Define a function to generate a JWT token with the provided user ID
const generateToken = (id) => {
  // Generate a JWT token with the provided user ID and a secret key from environment variables
  // Set the token expiration to 30 days
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
