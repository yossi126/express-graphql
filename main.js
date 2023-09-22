const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./db/connect");

//graphql
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphql/schema/index");
const resovlers = require("./graphql/resolvers/index");
//utils
const createUsersForDB = require("./utils/createUsersForDB");
const authMiddleware = require("./middleware/is-auth");

const { createLogFile, writeToLogFile } = require("./utils/log-utils");

//middleware
app.use(express.json());

app.use("/js", express.static("./client/js"));
app.use("/", express.static("./client/pages"));

app.use(authMiddleware);

app.use(cors());
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: resovlers,
    graphiql: true,
  })
);

const port = 8000;
const start = async () => {
  try {
    await connectDB();
    await createUsersForDB();
    //TODO: fix this. when there isnt log filw server is booting twice - maybe becuse of the nodemon
    await createLogFile();
    await writeToLogFile();
    app.listen(port, () => {
      console.log(
        `Running a GraphQL API server at http://localhost:${port}/graphql, Login for the client at http://localhost:8000/login.html`
      );
    });
  } catch (error) {
    console.log(error);
  }
};

start();
