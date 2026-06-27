const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    console.log(
      "MongoDB URL exists:",
      !!process.env.MONGODB_CONNECTION_URL
    );

    await mongoose.connect(process.env.MONGODB_CONNECTION_URL);

    console.log("✅ MongoDB Atlas Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error(error);

    process.exit(1);
  }
};

module.exports = connectDB;