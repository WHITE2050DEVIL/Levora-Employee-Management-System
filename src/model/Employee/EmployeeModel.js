//External Lib Import
const { model, Schema } = require("mongoose");

const EmployeesSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
    },

    Phone: {
      type: String,
      required: true,
      unique: true,
    },

    Email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: (prop) =>
          `Invalid Email Address: ${prop.value}`,
      },
    },

    Password: {
      type: String,
      required: true,
    },

    Roles: {
      type: String,
      enum: ["STAFF", "HOD", "ADMIN"],
      default: "STAFF",
    },

    Image: {
      type: String,
      default: "",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const EmployeesModel = model(
  "Employee",
  EmployeesSchema
);

module.exports = EmployeesModel;