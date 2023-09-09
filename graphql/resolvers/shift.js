const Shift = require("../../models/shift");
const Employee = require("../../models/employee");

module.exports = {
  createShift: async (args) => {
    try {
      const date = new Date(args.shiftInput.date);
      const shift = new Shift({
        date: args.shiftInput.date,
        startingHour: date.getHours(),
        endingHour: date.getHours() + 8,
      });

      const result = await Shift.create(shift);
      return result;
    } catch (error) {
      throw error;
    }
  },
  shifts: async () => {
    try {
      const data = await Shift.find({}).populate("userId");

      const shifts = data.map((shift) => {
        return {
          ...shift._doc,
          date: shift.date.toISOString(),
          startingHour: shift.startingHour,
          endingHour: shift.endingHour,
        };
      });
      return shifts;
    } catch (error) {
      throw error;
    }
  },
  shift: async (args) => {
    try {
      const shift = await Shift.findById(args.id).populate("userId");
      if (!shift) throw new Error("Shift not found");
      return shift;
    } catch (error) {
      throw error;
    }
  },
  addUserToShift: async ({ shiftId, userId }) => {
    try {
      const shift = await Shift.findOne({ _id: shiftId });
      if (!shift) throw new Error("Shift not found");

      const employee = await Employee.findOne({ _id: userId });
      const emloyeeExists = shift.userId.find((obj) => obj._id == userId);

      if (shift.userId.length >= 0 && !emloyeeExists && employee) {
        const shift = await Shift.findOneAndUpdate(
          { _id: shiftId },
          { $push: { userId: userId } },
          {
            new: true,
            runValidators: true,
          }
        );
        if (!shift) throw new Error("Shift not found");
        return shift.populate("userId");
      } else if (emloyeeExists) {
        throw new Error("You have assigned an employee to the current shift");
      } else if (!employee) {
        throw new Error("Employee not found");
      }
    } catch (error) {
      throw error;
    }
  },
};
