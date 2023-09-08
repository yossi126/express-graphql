const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  _id: Number,
  fullName: {
    type: String,
  },
  numOfActions: {
    type: Number,
  },
});

module.exports = mongoose.model("User", UserSchema);
