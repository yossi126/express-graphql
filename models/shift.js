const mongoose = require("mongoose");

const ShiftSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  startingHour: {
    type: Number,
  },
  endingHour: {
    type: Number,
  },
  userId: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Employee",
    },
  ],
});

ShiftSchema.index({ date: 1, userId: 1 });

module.exports = mongoose.model("Shift", ShiftSchema);
