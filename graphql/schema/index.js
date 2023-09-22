const { buildSchema } = require("graphql");

module.exports = buildSchema(`
type Employee{
    _id: ID
    firstName: String
    departmentID: Department
}

type Department{
    _id: ID
    name: String
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
    lastName: String
    startWorkYear: Int
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
    startingHour: Int
    endingHour: Int
}

type RootQuery{
    employee(id: String):Employee
    employees:[Employee]
    employeeShifts(id: String):[Shift]
    
    department(id: String):Department
    departments:[Department]

    users:[User]
    user:User

    shifts:[Shift]
    shift(id: String):Shift

    login(userName: String,email: String): AuthData
    logout: String
}

type RootMutation{
createEmployee(employeeInput: EmployeeInput):String
updateEmployee(id: String, employee: EmployeeInput):Employee   
deleteEmployee(id: String):Employee

createDepartment(departmentInput: DepartmentInput):String
updateDepartment(id: String, department: DepartmentInput):String
deleteDepartment(id: String):String
updateEmployeesDepartmentToNull(employeeIds: [String]):String

createUser(userInput: UserInput): [User]

createShift(shiftInput: ShiftInput): String
addUserToShift(shiftId: String, userId: String): Shift
updateShift(id: String, shift: ShiftInput): String
removeEmployeesFromShift(shiftId: String, employeeIds: [String]): String
addEmployeesFromShift(shiftId: String, employeeIds: [String]): String
updateShiftEmployees(shiftId: String, employeeIdsToAdd: [String], employeeIdsToRemove:[String]): String




}

schema{
    query:RootQuery
    mutation:RootMutation
}
`);
