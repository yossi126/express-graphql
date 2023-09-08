const mongoose = require("mongoose");

const connectDB = () => {
  return mongoose
    .connect("mongodb://localhost:27017/relationshipDB")
    .then(() => console.log("connected to relationshipDB"))
    .catch((error) => console.log(error));
};

module.exports = connectDB;
