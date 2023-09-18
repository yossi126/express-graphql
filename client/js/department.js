import { getUser, logout, checkAuthentication } from "./utils.js";
const logoutBtn = document.getElementById("logout");
const addDepartmentBtn = document.getElementById("addDepartment");

document.addEventListener("DOMContentLoaded", function () {
  window.onload = checkAuthentication;
  logoutBtn.addEventListener("click", logout);
  addDepartmentBtn.addEventListener("click", () => {
    window.location.href = "newDepartment.html";
  });
  getUser();
  initEmployeesTable();
  const employeesLink = document.getElementById("departmentLink");
  employeesLink.classList.add("active");
});

const initEmployeesTable = async () => {
  try {
    const departments = await getAllDepartments();
    const employees = await getAllEmployees();
    const departmnetsTable = document.getElementById("departmentTable");

    departments.forEach((department) => {
      const filteredEmployees = employees.filter((employee) =>
        employee.departmentID !== null
          ? employee.departmentID._id === department._id
          : ""
      );

      const row = document.createElement("tr");
      row.innerHTML = `
        <td><a href="editDepartment.html?id=${department._id}">${
        department.name
      }</a></td>
        <td>${
          department.manager === null ? "No manager" : `${department.manager}`
        }</td>
        <td>${filteredEmployees
          .map(
            (employee) =>
              `<a href="editEmployee.html?id=${employee._id}">${employee.firstName}</a>`
          )
          .join("<br>")}</td>
      
      `;
      departmnetsTable.appendChild(row);
    });
  } catch (error) {
    console.error("GraphQL request error initEmployeesTable:", error);
  }
};

const getAllDepartments = async () => {
  try {
    const response = await axios.post("http://localhost:8000/graphql", {
      query: `
              {
                departments {
                  _id
                  manager
                  name
                }
              }
            `,
    });

    const { departments } = response.data.data;
    return departments;
  } catch (error) {
    console.error("GraphQL request error getAllDepartments:", error);
  }
};

const getAllEmployees = async () => {
  try {
    const response = await axios.post("http://localhost:8000/graphql", {
      query: `
              {
                employees {
                  _id
                  firstName
                  departmentID{
                    _id
                      name
                  }
                }
              }
            `,
    });

    const { employees } = response.data.data;
    return employees;
  } catch (error) {
    console.error("GraphQL request error getAllEmployees:", error);
  }
};
