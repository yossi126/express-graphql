const Department = require("../../models/department");
const Employee = require("../../models/employee");
module.exports = {
  departments: async () => {
    try {
      const departments = await Department.find({});
      if (!departments) {
        throw new Error(`No department with id: ${args.id}`);
      }
      return departments;
    } catch (error) {
      console.log(error);
    }
  },
  department: async (args) => {
    try {
      const department = await Department.findById(args.id);
      if (!department) {
        throw new Error(`No department with id: ${args.id}`);
      }
      return department;
    } catch (err) {
      throw err;
    }
  },
  createDepartment: async (args, req) => {
    try {
      await Department.create(args.departmentInput);
      return "Department created successfully";
    } catch (error) {
      console.log("createDepartment error:", error);
      return "Department not created, try again";
    }
  },
  updateDepartment: async (args) => {
    try {
      const department = await Department.findByIdAndUpdate(
        args.id,
        args.department,
        {
          new: true,
        }
      );
      if (!department) {
        throw new Error(`No department with id: ${args.id}`);
      }

      return "Department updated successfully";
    } catch (error) {
      return error.message;
    }
  },
  updateEmployeesDepartmentToNull: async (args) => {
    try {
      // Find and update the employees with the given IDs
      await Employee.updateMany(
        { _id: { $in: args.employeeIds } },
        { $set: { departmentID: null } }
      );

      return `Updated ${args.employeeIds.length} employees`;
    } catch (error) {
      console.log(`Error updating employees: ${error}`);
    }
  },
  deleteDepartment: async (args) => {
    try {
      const department = await Department.findByIdAndDelete(args.id);
      if (!department) {
        throw new Error(`No department with id: ${args.id}`);
      }
      return "Department deleted successfully";
    } catch (error) {
      return error.message;
    }
  },
};
