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

// Define the pre hook to run before department deletion
departmentSchema.pre("remove", async function (next) {
  const department = this;
  const employeesToUpdate = await mongoose.model("Employee").find({
    departmentID: department._id,
  });

  // Update the departmentID of each employee to null
  for (const employee of employeesToUpdate) {
    employee.departmentID = null;
    await employee.save();
  }

  // Continue with the department deletion
  next();
});

module.exports = mongoose.model("Department", departmentSchema);
