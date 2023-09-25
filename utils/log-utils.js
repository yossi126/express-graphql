const jsonfile = require("jsonfile");
const fs = require("fs");
const path = require("path");
const User = require("../models/user");

//directions for the log file
const directoryName = "logs";
const actionsLogFileName = "actions-log.json";
// Define the path to the actions log directory
const rootDirectory = path.dirname(require.main.filename);
const directoryPath = path.join(rootDirectory, directoryName);
// Define the path to the actions log file
const actionsLogFilePath = path.join(directoryPath, actionsLogFileName);
// Check if the actions log file exists
const doesActionsLogFileExist = fs.existsSync(actionsLogFilePath);

// function to create the log file
const createLogFile = async () => {
  // Create the directory if it doesn't exist
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }
  // If the file doesn't exist, create it with an empty array
  if (!doesActionsLogFileExist) {
    jsonfile.writeFileSync(actionsLogFilePath, []);
    return true;
  } else {
    return false;
  }
};

const writeToLogFile = async (userId, maxActions, usedActions) => {
  const data = await jsonfile.readFile(actionsLogFilePath);
  //creating a date formatted as dd/mm/yyyy
  const formattedDate = createFormattedDate();
  // filter only the logs with the current date
  const filteredData = data.filter((item) => {
    return item.id === userId && item.date === formattedDate;
  });
  // if its the fisrt time the log is been written
  if (filteredData.length === 0 && userId !== undefined) {
    console.log("wrtie to log file for first time....");
    data.push({
      id: userId,
      maxActions: maxActions,
      date: formattedDate,
      actionAllowd: maxActions - usedActions,
    });
    jsonfile.writeFileSync(actionsLogFilePath, data);
  } else if (userId !== undefined) {
    //loop throw the user logs and get the last actionAllowd that means how much actions left for the user
    let lastActionAllowd = null;
    for (const item of filteredData) {
      if (item.actionAllowd !== undefined) {
        lastActionAllowd = item.actionAllowd;
      }
    }

    data.push({
      id: userId,
      maxActions: maxActions,
      date: formattedDate,
      actionAllowd: lastActionAllowd - usedActions,
    });
    jsonfile.writeFileSync(actionsLogFilePath, data);
  }
};

const checkRemainActions = async (userId) => {
  const data = await jsonfile.readFile(actionsLogFilePath);
  if (data.length === 0) {
    return true;
  } else {
    const currentFormattedDate = createFormattedDate();
    // filter only the logs with the current date
    const filteredData = data.filter((item) => {
      return item.id === userId && item.date === currentFormattedDate;
    });
    //loop throw the user logs and get the last actionAllowd that means how much actions left for the user
    let lastActionAllowd = null;
    for (const item of filteredData) {
      if (item.actionAllowd !== undefined) {
        lastActionAllowd = item.actionAllowd;
      }
    }
    if (lastActionAllowd === 0) {
      throw new Error("no actions left for today ! come back tomarrow");
    }
    return true;
  }
};

const checkRemainActionsInMiddeleware = async (userId, actionCount) => {
  const data = await jsonfile.readFile(actionsLogFilePath);
  //console.log(userId, actionCount);
  let lastActionAllowd = null;
  const currentFormattedDate = createFormattedDate();
  //console.log(currentFormattedDate);
  // filter only the logs with the current date
  const filteredData = data.filter((item) => {
    return item.id === userId && item.date === currentFormattedDate;
  });
  //console.log(filteredData);
  if (data.length === 0) {
    return true;
  } else {
    //loop throw the user logs and get the last actionAllowd that means how much actions left for the user
    for (const item of filteredData) {
      if (item.actionAllowd !== undefined) {
        lastActionAllowd = item.actionAllowd;
      }
    }
  }
  // console.log(
  //   "outside lastActionAllowd: " + lastActionAllowd,
  //   "actionCount: " + actionCount
  // );
  if (lastActionAllowd === parseInt(actionCount)) {
    // console.log(
    //   "lastActionAllowd: " + lastActionAllowd,
    //   "actionCount: " + actionCount
    // );
    data.push({
      id: userId,
      maxActions: filteredData[0].maxActions,
      date: currentFormattedDate,
      actionAllowd: lastActionAllowd - parseInt(actionCount),
    });
    jsonfile.writeFileSync(actionsLogFilePath, data); // Provide the full path
    return false;
  }
  return true;
};

const createFormattedDate = () => {
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0"); // Get day and pad with leading zero if needed
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Get month (add 1 because months are zero-based) and pad with leading zero if needed
  const year = currentDate.getFullYear(); // Get full year
  const currentFormattedDate = `${day}/${month}/${year}`;
  return currentFormattedDate;
};

const getCurrentActionsForUser = async (userId) => {
  const user = await User.findById(userId);
  //read the file
  const data = await jsonfile.readFile(actionsLogFilePath);
  // if there is nothing in the file return the num of actions of the user
  if (data.length === 0) {
    return user.numOfActions;
  } else {
    const currentFormattedDate = createFormattedDate();
    // filter only the logs with the current date
    const filteredData = data.filter((item) => {
      return item.id === userId && item.date === currentFormattedDate;
    });
    // if there is no log of the user return the num of actions of the user
    if (filteredData.length === 0) {
      return user.numOfActions;
    } else {
      // if the filterData contains the user log return the last actionAllowd that means how much actions left for the user
      let lastActionAllowd = null;
      for (const item of filteredData) {
        if (item.actionAllowd !== undefined) {
          lastActionAllowd = item.actionAllowd;
        }
      }
      return lastActionAllowd;
    }
  }
};

module.exports = {
  createLogFile,
  writeToLogFile,
  checkRemainActions,
  checkRemainActionsInMiddeleware,
  getCurrentActionsForUser,
  actionsLogFilePath,
};
