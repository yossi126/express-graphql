const { buildSchema } = require("graphql");

module.exports = buildSchema(`
type Employee{
    _id: ID!
    firstName: String!
    departmentID: String
}

type Department{
    _id: ID!
    name: String!
    manager: String
}

type User{
    _id: Int
    fullName: String
    numOfActions: Int
}

type AuthData{
    userId: Int
    token: String
    tokenExpiration: Int
}

input EmployeeInput{
    firstName: String!
    departmentID: String
}

input DepartmentInput{
    name: String!
    manager: String
}

input UserInput{
    _id: Int
    fullName: String
    numOfActions: Int
}

type RootQuery{
    employees:[Employee!]!
    departments:[Department!]!
    users:[User!]!
    login(userName: String,email: String): AuthData
}

type RootMutation{
createEmployee(employeeInput: EmployeeInput):Employee
createDepartment(departmentInput: DepartmentInput):Department
createUser(userInput: UserInput): [User]

}

schema{
    query:RootQuery
    mutation:RootMutation
}
`);
