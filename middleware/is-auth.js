const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    req.isAuth = false;
    //console.log(req);
    console.log("1", req.path);
    return next();
  }
  const token = authHeader.split(" ")[1]; //Bearer token
  if (!token || token === "") {
    req.isAuth = false;
    console.log("2", req.path);
    return next();
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    req.isAuth = false;
    console.log("3", req.path);
    return next();
  }
  if (!decodedToken) {
    req.isAuth = false;
    console.log("4", req.path);
    return next();
  }
  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
};
