const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const { getUsers } = require("../../api/jsonPlaceHolder");
require("dotenv").config();

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
    const users = await getUsers();
    const user = users.find(
      (user) => user.username === userName && user.email === email
    );
    if (!user) {
      throw new Error("User not found");
    }

    const token = jwt.sign(
      { userId: user.id, userName: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return { userId: user.id, token: token, tokenExpiration: 1 };
  },
  user: async (args, req) => {
    // if (!req.isAuth) {
    //   throw new Error("Unauthenticated");
    // }
    //console.log(req.isAuth);
    try {
      const user = await User.findById(req.userId);
      return user;
    } catch (err) {
      throw err;
    }
  },
};
