const User = require("../models/user");
const { getUsers } = require("../api/jsonPlaceHolder");

module.exports = async () => {
  try {
    const isEmpty = (await User.countDocuments({})) === 0;
    if (isEmpty) {
      const users = await getUsers();
      users.forEach(async (user) => {
        await User.create({
          _id: user.id,
          fullName: user.name,
          numOfActions: 10,
        });
      });
      console.log("users created");
    } else {
      console.log("users exist in db");
    }
  } catch (error) {
    console.log(error);
  }
};
