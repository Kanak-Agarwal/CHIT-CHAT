// Importing the express-async-handler middleware to handle asynchronous functions in Express
const asyncHandler = require("express-async-handler");
// Importing the Message model
const Message = require("../models/messageModel");
// Importing the User model
const User = require("../models/userModel");
// Importing the Chat model
const Chat = require("../models/chatModel");

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    // Find all messages for the given chat ID and populate the sender and chat fields
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    // Send the messages as a JSON response
    res.json(messages);
  } catch (error) {
    // If an error occurs, set the status to 400 and throw the error
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  // Destructure the content and chatId from the request body
  const { content, chatId } = req.body;

  // Check if content or chatId is missing
  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    // If any data is missing, send a status of 400 (Bad Request)
    return res.sendStatus(400);
  }

  // Create a new message object
  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    // Create the message in the database
    var message = await Message.create(newMessage);

    // Populate sender, chat, and chat.users fields for the created message
    message = await message.populate("sender", "name pic").execPopulate();
    message = await message.populate("chat").execPopulate();
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    // Update the latestMessage field in the corresponding chat
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    // Send the created message as a JSON response
    res.json(message);
  } catch (error) {
    // If an error occurs, set the status to 400 and throw the error
    res.status(400);
    throw new Error(error.message);
  }
});

// Exporting the allMessages and sendMessage functions
module.exports = { allMessages, sendMessage };
