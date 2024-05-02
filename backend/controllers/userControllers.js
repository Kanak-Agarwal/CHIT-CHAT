// Importing the express-async-handler middleware to handle asynchronous functions in Express
const asyncHandler = require("express-async-handler");
// Importing the User model
const User = require("../models/userModel");
// Importing the generateToken function from the config directory
const generateToken = require("../config/generateToken");

// Controller function to get all users
const allUsers = asyncHandler(async (req, res) => {
  // Define a keyword based on the search query parameter
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  // Find all users based on the keyword and excluding the current user
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  // Send the users as a response
  res.send(users);
});

// Controller function to register a new user
const registerUser = asyncHandler(async (req, res) => {
  // Destructure name, email, password, and pic from the request body
  const { name, email, password, pic } = req.body;

  // Check if name, email, and password are provided
  if (!name || !email || !password) {
    // If any required field is missing, send a status of 400 (Bad Request) and throw an error
    res.status(400);
    throw new Error("Please Enter all the Fields");
  }

  // Check if the user already exists with the provided email
  const userExists = await User.findOne({ email });

  if (userExists) {
    // If the user already exists, send a status of 400 (Bad Request) and throw an error
    res.status(400);
    throw new Error("User already exists");
  }

  // Create a new user
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  // If the user is created successfully, send a status of 201 (Created) and return user details with a JWT token
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    // If the user is not found, send a status of 400 (Bad Request) and throw an error
    res.status(400);
    throw new Error("User not found");
  }
});

// Controller function to authenticate a user
const authUser = asyncHandler(async (req, res) => {
  // Destructure email and password from the request body
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    // If any required field is missing, send a status of 400 (Bad Request) and throw an error
    res.status(400);
    throw new Error("Please Enter all the Fields");
  }

  // Find the user by email
  const user = await User.findOne({ email });

  // If the user is found and the password matches, return user details with a JWT token
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    // If the user is not found or the password does not match, send a status of 401 (Unauthorized) and throw an error
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

// Exporting the allUsers, registerUser, and authUser functions
module.exports = { allUsers, registerUser, authUser };
