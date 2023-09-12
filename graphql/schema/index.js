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

type Shift{
    _id: ID
    date: String
    startingHour: Int
    endingHour: Int
    userId: [Employee]
}

input EmployeeInput{
    firstName: String
    departmentID: String
}

input DepartmentInput{
    name: String
    manager: String
}

input UserInput{
    _id: Int
    fullName: String
    numOfActions: Int
    
}

input ShiftInput{
    date: String
}

type RootQuery{
    employee(id: String):Employee
    employees:[Employee!]!
    
    department(id: String):Department
    departments:[Department]

    users:[User]
    user:User

    shifts:[Shift]
    shift(id: String):Shift

    login(userName: String,email: String): AuthData
}

type RootMutation{
createEmployee(employeeInput: EmployeeInput):Employee
updateEmployee(id: String, employee: EmployeeInput):Employee   
deleteEmployee(id: String):Employee

createDepartment(departmentInput: DepartmentInput):Department
updateDepartment(id: String, department: DepartmentInput):Department

createUser(userInput: UserInput): [User]

createShift(shiftInput: ShiftInput): Shift
addUserToShift(shiftId: String, userId: String): Shift

}

schema{
    query:RootQuery
    mutation:RootMutation
}
`);
