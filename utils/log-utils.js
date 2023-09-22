const jsonfile = require("jsonfile");
const fs = require("fs");
const path = require("path");

const createLogFile = async () => {
  const directoryName = "logs";
  const actionsLogFileName = "actions-log.json";
  // Define the path to the actions log directory
  const rootDirectory = path.dirname(require.main.filename);
  const directoryPath = path.join(rootDirectory, directoryName);
  // Create the directory if it doesn't exist
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }
  // Define the path to the actions log file
  const actionsLogFilePath = path.join(directoryPath, actionsLogFileName);
  // Check if the actions log file exists
  const doesActionsLogFileExist = fs.existsSync(actionsLogFilePath);
  // If the file doesn't exist, create it with an empty array
  if (!doesActionsLogFileExist) {
    jsonfile.writeFileSync(actionsLogFilePath, []);
    return true;
  } else {
    return false;
  }
};

const writeToLogFile = async (userId, maxActions, usedActions) => {
  const directoryName = "logs";
  const actionsLogFileName = "actions-log.json";
  // Define the path to the actions log directory
  const rootDirectory = path.dirname(require.main.filename);
  const directoryPath = path.join(rootDirectory, directoryName);
  // Define the path to the actions log file
  const actionsLogFilePath = path.join(directoryPath, actionsLogFileName);
  const data = await jsonfile.readFile(actionsLogFilePath);
  // if its the fisrt time the log is been written

  //creating a date formatted as dd/mm/yyyy
  const formattedDate = createFormattedDate();
  const filteredData = data.filter((item) => {
    return item.id === userId && item.date === formattedDate;
  });

  if (filteredData.length === 0 && userId !== undefined) {
    console.log("wrtie to log file for first time....");

    data.push({
      id: userId,
      maxActions: maxActions,
      date: formattedDate,
      actionAllowd: maxActions - usedActions,
    });
    jsonfile.writeFileSync(actionsLogFilePath, data); // Provide the full path
  } else {
    let lastActionAllowd = null;
    for (const item of filteredData) {
      if (item.actionAllowd !== undefined) {
        lastActionAllowd = item.actionAllowd;
      }
    }
    //console.log(typeof lastActionAllowd, typeof usedActions);
    if (lastActionAllowd === parseInt(usedActions)) {
      //console.log(lastActionAllowd, usedActions);
    }
  }
};

const checkRemainActions = async (userId) => {
  const directoryName = "logs";
  const actionsLogFileName = "actions-log.json";
  // Define the path to the actions log directory
  const rootDirectory = path.dirname(require.main.filename);
  const directoryPath = path.join(rootDirectory, directoryName);
  // Define the path to the actions log file
  const actionsLogFilePath = path.join(directoryPath, actionsLogFileName);
  const data = await jsonfile.readFile(actionsLogFilePath);
  if (data.length === 0) {
    return true;
  } else {
    const currentFormattedDate = createFormattedDate();

    const filteredData = data.filter((item) => {
      return item.id === userId && item.date === currentFormattedDate;
    });

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
  const directoryName = "logs";
  const actionsLogFileName = "actions-log.json";
  // Define the path to the actions log directory
  const rootDirectory = path.dirname(require.main.filename);
  const directoryPath = path.join(rootDirectory, directoryName);
  // Define the path to the actions log file
  const actionsLogFilePath = path.join(directoryPath, actionsLogFileName);
  const data = await jsonfile.readFile(actionsLogFilePath);
  let lastActionAllowd = null;
  const currentFormattedDate = createFormattedDate();
  const filteredData = data.filter((item) => {
    return item.id === userId && item.date === currentFormattedDate;
  });
  if (data.length === 0) {
    return true;
  } else {
    for (const item of filteredData) {
      if (item.actionAllowd !== undefined) {
        lastActionAllowd = item.actionAllowd;
      }
    }
  }
  if (lastActionAllowd === parseInt(actionCount)) {
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

module.exports = {
  createLogFile,
  writeToLogFile,
  checkRemainActions,
  checkRemainActionsInMiddeleware,
};
