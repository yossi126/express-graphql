const mongoose = require("mongoose");
const Department = require("./department");
const Shift = require("./shift");

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

emploeeSchema.pre("remove", async function (next) {
  // Remove the employee from their department
  if (this.departmentID) {
    const department = await Department.findById(this.departmentID);
    if (department) {
      department.manager = null; // Remove the manager reference if the employee is the manager
      await department.save();
    }
  }

  // Remove the employee from all shifts
  await Shift.updateMany({ userId: this._id }, { $pull: { userId: this._id } });

  next();
});

module.exports = mongoose.model("Employee", emploeeSchema);
