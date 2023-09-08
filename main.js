const express = require("express");
const app = express();
const connectDB = require("./db/connect");
const isAuth = require("./middleware/is-auth");
//graphql
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphql/schema/index");
const resovlers = require("./graphql/resolvers/index");
//utils
const createUsersForDB = require("./utils/createUsersForDB");

//middleware
app.use(express.json());
app.use(isAuth);
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
