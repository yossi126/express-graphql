const Employee = require("../../models/employee");
const User = require("../../models/user");

module.exports = {
  employee: async (args) => {
    try {
      const employee = await Employee.findById(args.id);
      return employee;
    } catch (error) {
      throw error;
    }
  },
  employees: async (args, req) => {
    try {
      const employees = await Employee.find({});
      const user = await User.findById(req.userId);
      return employees;
    } catch (error) {
      throw error;
    }
  },
  createEmployee: async (args) => {
    try {
      const employee = await Employee.create(args.employeeInput);
      return employee;
    } catch (error) {
      throw error;
    }
  },

  updateEmployee: async (args) => {
    const employee = await Employee.findByIdAndUpdate(args.id, args.employee, {
      new: true,
    });
    if (!employee) {
      throw new Error("Employee not found");
    }

    return employee;
  },

  deleteEmployee: async (args) => {
    const employee = await Employee.findByIdAndDelete(args.id);
    if (!employee) {
      throw new Error("Employee not found");
    }

    return employee;
  },
};
