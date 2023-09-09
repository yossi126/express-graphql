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

// emploeeSchema.pre("remove", async function (next) {
//   await this.employee.model("Shift").deleteMany({ userId: this._id });
// });

module.exports = mongoose.model("Employee", emploeeSchema);
