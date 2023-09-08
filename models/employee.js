const mongoose = require("mongoose");

const emploeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  startWorkYear: {
    type: Number,
  },
  departmentID: {
    type: mongoose.Schema.ObjectId,
    ref: "Department",
    default: null,
  },
});

module.exports = mongoose.model("Employee", emploeeSchema);
