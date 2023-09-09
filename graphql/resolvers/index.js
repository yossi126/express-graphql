const authResolver = require("./auth");
const departmentResolver = require("./department");
const employeesResolver = require("./employees");
const shiftResolver = require("./shift");

const rootResolver = {
  ...employeesResolver,
  ...departmentResolver,
  ...authResolver,
  ...shiftResolver,
};

module.exports = rootResolver;
