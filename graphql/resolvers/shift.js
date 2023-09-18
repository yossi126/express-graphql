const Shift = require("../../models/shift");
const Employee = require("../../models/employee");

module.exports = {
  createShift: async (args) => {
    console.log(args);
    try {
      const date = new Date(args.shiftInput.date);
      const shift = new Shift({
        date: date.toDateString(),
        startingHour: args.shiftInput.startingHour,
        endingHour: args.shiftInput.endingHour,
      });

      await Shift.create(shift);
      return "Shift created";
    } catch (error) {
      console.log(error);
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

  updateShift: async (args) => {
    try {
      const shift = await Shift.findOne({ _id: args.id });
      if (!shift) throw new Error("Shift not found");

      const date = new Date(args.shift.date);
      const updatedShift = await Shift.findOneAndUpdate(
        { _id: args.id },
        {
          date: args.shift.date,
          startingHour: date.getHours(),
          endingHour: date.getHours() + 8,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      if (!updatedShift) throw new Error("Shift not found");
      return "Shift updated";
    } catch (error) {
      throw error;
    }
  },
  removeEmployeesFromShift: async (args) => {
    try {
      const shiftId = args.shiftId;
      const employeeIds = args.employeeIds;

      // Use the update method with $pull to remove employees from the shift
      const result = await Shift.updateOne(
        { _id: shiftId },
        { $pull: { userId: { $in: employeeIds } } }
      );

      if (result.nModified === 0) {
        // If no employees were removed, it means shift or employees were not found
        throw new Error("Shift or employees not found");
      }

      return "Employees removed successfully";
    } catch (error) {
      throw error;
    }
  },
  addEmployeesFromShift: async (args) => {
    try {
      const shiftId = args.shiftId;
      const employeeIds = args.employeeIds;

      // Use the update method with $pull to remove employees from the shift
      const result = await Shift.updateOne(
        { _id: shiftId },
        { $addToSet: { userId: { $each: employeeIds } } }
      );

      if (result.nModified === 0) {
        // If no employees were removed, it means shift or employees were not found
        throw new Error("Shift or employees not found");
      }

      return "Employees added successfully";
    } catch (error) {
      throw error;
    }
  },
  updateShiftEmployees: async (args) => {
    try {
      const shiftId = args.shiftId;
      const employeeIdsToAdd = args.employeeIdsToAdd || [];
      const employeeIdsToRemove = args.employeeIdsToRemove || [];

      // Fetch the existing employee IDs in the shift
      const shift = await Shift.findById(shiftId);
      if (!shift) {
        throw new Error("Shift not found");
      }
      const existingEmployeeIds = shift.userId.map(String); // Convert to string for comparison

      // Filter out employee IDs that are already in the shift
      const uniqueEmployeeIdsToAdd = employeeIdsToAdd.filter(
        (employeeId) => !existingEmployeeIds.includes(employeeId)
      );

      // Use the update method with $pull to remove employees from the shift
      const result = await Shift.updateOne(
        { _id: shiftId },
        {
          $pull: { userId: { $in: employeeIdsToRemove } },
          $addToSet: { userId: { $each: uniqueEmployeeIdsToAdd } },
        }
      );

      if (result.nModified === 0) {
        throw new Error("Shift or employees not found");
      }

      return "Shift employees updated successfully";
    } catch (error) {
      throw error;
    }
  },
};
