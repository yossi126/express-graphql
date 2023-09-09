const Department = require("../../models/department");

module.exports = {
  departments: async () => {
    try {
      const departments = await Department.find({});
      if (!departments) {
        throw new Error(`No department with id: ${args.id}`);
      }
      return departments;
    } catch (error) {}
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
    console.log("createDepartment " + req.userId);
    const department = await Department.create(args.departmentInput);
    return department;
  },
  updateDepartment: async (args) => {
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

    return department;
  },
};
