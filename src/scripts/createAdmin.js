const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const EmployeeModel = require("../src/model/Employee/EmployeeModel");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);

    const hashedPassword = await bcrypt.hash("admin@123", 10);

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
      { upsert: true, new: true }
    );

    console.log("✅ Admin created/updated:", admin.Email);

    process.exit();
  } catch (err) {
    console.log("❌ Error:", err);
    process.exit(1);
  }
};

createAdmin();