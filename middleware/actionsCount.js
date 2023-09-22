const userActionCounts = new Map();
module.exports = (req, res, next) => {
  console.log("actionsCount");
  // if (req.isAuth) {
  //     const userId = req.userId;
  //     if (!userActionCounts.has(userId)) {
  //       userActionCounts.set(userId, 0);
  //     }
  //     const userActionCount = userActionCounts.get(userId);

  //     // Check if the user has reached the maximum allowed actions
  //     if (userActionCount >= req.actions) {
  //       // Disconnect the user or take appropriate action
  //       // For example, you can send a response to the client to notify them
  //       // that they have reached their limit and should log out.
  //       return res.status(403).json({ message: 'You have reached your action limit.' });
  //     }

  //     // Increment the action count for this session
  //     userActionCounts.set(userId, userActionCount + 1);
  //   }
  next();
};
