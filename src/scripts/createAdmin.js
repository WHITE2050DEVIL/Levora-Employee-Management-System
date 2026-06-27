const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const EmployeeModel = require("../model/Employee/EmployeeModel");

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_CONNECTION_URL || process.env.DB_URL
    );

    console.log("✅ MongoDB Connected");

    // Hash admin password
    const hashedPassword = await bcrypt.hash("admin@123", 10);

    // Create or Update Admin
    const admin = await EmployeeModel.findOneAndUpdate(
      { Email: "admin@gmail.com" },
      {
        Name: "System Admin",
        FirstName: "System",
        LastName: "Admin",
        Email: "admin@gmail.com",
        Password: hashedPassword,
        Roles: "ADMIN",
        Phone: "9999999999",
        Gender: "Male",
        DateOfBirth: "1990-01-01",
        Address: "System",
        Image: "default.png",
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    console.log("✅ Admin created/updated successfully");
    console.log("📧 Email:", admin.Email);

    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
};

createAdmin();