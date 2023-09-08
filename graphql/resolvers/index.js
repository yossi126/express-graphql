// import the models
const Employee = require("../../models/employee");
const Department = require("../../models/department");
const User = require("../../models/user");
// import the api
const { getUsers } = require("../../api/jsonPlaceHolder");
const jwt = require("jsonwebtoken");

module.exports = {
  employees: async (args, req) => {
    try {
      const employees = await Employee.find({});
      const user = await User.findById(req.userId);
      console.log(user.fullName);
      return employees;
    } catch (error) {
      console.log(error);
    }
  },
  createEmployee: async (args) => {
    const employee = await Employee.create(args.employeeInput);
    return employee;
  },
  departments: async () => {
    const departments = await Department.find({});
    return departments;
  },
  createDepartment: async (args, req) => {
    console.log("createDepartment " + req.userId);
    const department = await Department.create(args.departmentInput);
    return department;
  },
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
      (user) => user.name === userName && user.email === email
    );
    if (!user) {
      throw new Error("User not found");
    }

    const token = jwt.sign(
      { userId: user.id, userName: user.name },
      "somesupersecretkey",
      { expiresIn: "1h" }
    );
    return { userId: user.id, token: token, tokenExpiration: 1 };
  },
};
