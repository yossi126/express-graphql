const axios = require("axios");
const url = "https://jsonplaceholder.typicode.com/users";

const getUsers = async () => {
  const { data } = await axios.get(url);
  return data;
};

module.exports = {
  getUsers,
};
