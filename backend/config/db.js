const mongoose = require("mongoose"); // Import the Mongoose library for MongoDB interactions
const colors = require("colors"); // Import the 'colors' library for colorful console logging

// Define a function to connect to the MongoDB database
const connectDB = async () => {
  try {
    // Attempt to connect to the MongoDB database using the provided URI
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true, // Use the new URL parser
      useUnifiedTopology: true, // Use the new Server Discover and Monitoring engine
    });

    // If the connection is successful, log a success message to the console with the host information
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    // If an error occurs during connection, log the error message to the console in red and bold
    console.error(`Error: ${error.message}`.red.bold);
    // Exit the process with a non-zero status code to indicate an error
    process.exit(1);
  }
};

// Export the connectDB function so it can be used in other parts of the application
module.exports = connectDB;
