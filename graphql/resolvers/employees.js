const Employee = require("../../models/employee");
const Shift = require("../../models/shift");

module.exports = {
  employee: async (args) => {
    try {
      const employee = await Employee.findById(args.id).populate(
        "departmentID"
      );
      return employee;
    } catch (error) {
      throw error;
    }
  },
  employees: async () => {
    try {
      const employees = await Employee.find({}).populate("departmentID");
      return employees;
    } catch (error) {
      throw error;
    }
  },
  createEmployee: async (args) => {
    try {
      await Employee.create(args.employeeInput);
      return "Employee created successfully";
    } catch (error) {
      console.log(error);
      return "Employee not created";
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
  employeeShifts: async (args) => {
    try {
      const data = await Shift.find({ userId: args.id });
      if (data.length === 0) throw new Error("No shifts yet");
      const shifts = data.map((shift) => {
        return {
          ...shift._doc,
          date: shift.date.toDateString(),
          startingHour: shift.startingHour,
          endingHour: shift.endingHour,
        };
      });
      return shifts;
    } catch (error) {
      throw error;
    }
  },
};
