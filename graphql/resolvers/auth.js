const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const { getUsers } = require("../../api/jsonPlaceHolder");
require("dotenv").config();
const { writeToLogFile, checkRemainActions } = require("../../utils/log-utils");

module.exports = {
  createUser: async () => {
    //get users from api and save to db
    const users = await getUsers();
    users.forEach(async (user) => {
      await User.create({
        _id: user.id,
        fullName: user.name,
        numOfActions: 10,
      });
    });
    const usersdb = await User.find({});
    return usersdb;
  },
  login: async ({ userName, email }) => {
    //get all the users from the api
    const users = await getUsers();
    // authenticate the user against the  mondo db
    const user = users.find(
      (user) => user.username === userName && user.email === email
    );
    if (!user) {
      throw new Error("Please check your credentials!");
    }
    //get the user frpm the db for his num of actions
    const existingUser = await User.findOne({ _id: user.id });
    if (!existingUser) {
      throw new Error("User not found in db");
    }

    //check if the user has actions left, if not he will logged out
    try {
      await checkRemainActions(user.id);
    } catch (error) {
      return error;
    }

    //create a token
    const token = jwt.sign(
      {
        userId: user.id,
        userName: user.name,
        numOfActions: existingUser.numOfActions,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return { userId: user.id, token: token, tokenExpiration: 1 };
  },
  user: async (args, req) => {
    if (!req.isAuth) {
      console.log("Unauthenticated");
      throw new Error("Unauthenticated");
    }
    if (req.actionsLeft === false) {
      throw new Error("no actions left");
    }

    try {
      const user = await User.findById(req.userId);
      return user;
    } catch (err) {
      throw err;
    }
  },
  users: async (args, req) => {
    if (!req.isAuth) {
      console.log("Unauthenticated");
      throw new Error("Unauthenticated");
    }
    if (req.actionsLeft === false) {
      throw new Error("no actions left");
    }
    try {
      const users = await User.find({});
      return users;
    } catch (err) {
      throw err;
    }
  },
  logout: async (args, req) => {
    const actionsCount = req.headers.actioncount;
    const token = req.headers.token;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decodedToken.userId });

    writeToLogFile(user._id, user.numOfActions, actionsCount);

    return "logout";
  },
};
