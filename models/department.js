const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  manager: {
    type: mongoose.Schema.ObjectId,
    ref: "Employee",
    default: null,
  },
});

module.exports = mongoose.model("Department", departmentSchema);
