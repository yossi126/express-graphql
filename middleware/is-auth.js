const jwt = require("jsonwebtoken");
const { checkRemainActionsInMiddeleware } = require("../utils/log-utils");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    req.isAuth = false;

    return next();
  }
  const token = authHeader.split(" ")[1]; //Bearer token
  if (!token || token === "") {
    req.isAuth = false;
    //console.log("2", req.path);
    return next();
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (req.actions == null) {
      //console.log("null");
    }
    //console.log(actions);
  } catch (err) {
    req.isAuth = false;
    //console.log("3", req.path);
    return next();
  }
  if (!decodedToken) {
    req.isAuth = false;
    //console.log("4", req.path);
    return next();
  }

  req.isAuth = true;
  req.userId = decodedToken.userId;
  req.actions = decodedToken.numOfActions;
  req.actionCount = req.headers.actioncount;

  const resutl = await checkRemainActionsInMiddeleware(
    req.userId,
    req.headers.actioncount
  );
  if (resutl === false) {
    req.actionsLeft = false;
    return next();
  }

  //console.log("5", req.path);
  next();
};
