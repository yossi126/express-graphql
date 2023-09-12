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
    app.listen(port, () => {
      console.log(
        `Running a GraphQL API server at http://localhost:${port}/graphql`
      );
    });
  } catch (error) {
    console.log(error);
  }
};

start();
