import {
  getUser,
  logout,
  checkAuthentication,
  formatDateToCustomFormat,
} from "./utils.js";
const logoutBtn = document.getElementById("logout");
const employeesLink = document.getElementById("employeesLink");
const departmentSelect = document.getElementById("departmentSelect");

document.addEventListener("DOMContentLoaded", function () {
  window.onload = checkAuthentication;
  logoutBtn.addEventListener("click", logout);
  getUser();
  initEmployeesTable();
  populateDepartmentDropdown();
  employeesLink.classList.add("active");
});

departmentSelect.addEventListener("change", () => {
  const selectedDepartment = departmentSelect.value;
  filterEmployees(selectedDepartment);
});

const getShiftForEmployee = async (id) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      "http://localhost:8000/graphql",
      {
        query: `
    query($id: String){
      employeeShifts(id: $id){
          date
          startingHour
          endingHour
      }
  }
        `,
        variables: {
          id: id,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          actionCount: localStorage.getItem("actionCount"),
        },
      }
    );

    const { data, errors } = response.data;
    //console.log("getShiftForEmployee");
    if (errors) {
      return errors[0].message;
    }

    const { employeeShifts } = data;
    // sort the shifts by date in ascending order
    employeeShifts.sort((a, b) => new Date(a.date) - new Date(b.date));
    return employeeShifts;
  } catch (error) {
    console.log("Network error:", error);
    return error;
  }
};

const getAllDepartments = async () => {
  try {
    const response = await axios.post("http://localhost:8000/graphql", {
      query: `
              {
                departments {
                  _id
                  name
                }
              }
            `,
    });
    //console.log("getAllDepartments");
    const { departments } = response.data.data;
    return departments;
  } catch (error) {
    console.error("GraphQL request error getAllDepartments:", error);
  }
};

const populateDepartmentDropdown = async () => {
  const departmentSelect = document.getElementById("departmentSelect");

  // Clear existing options
  departmentSelect.innerHTML = '<option value="">All Departments</option>';
  const departments = await getAllDepartments();
  // Add options for each department
  departments.forEach((department) => {
    const option = document.createElement("option");
    option.value = department._id;
    option.textContent = department.name;
    departmentSelect.appendChild(option);
  });
};

// Function to filter and display employees in a table
const filterEmployees = async (selectedDepartment) => {
  try {
    const employees = await getAllEmployees();
    const employeesTable = document.getElementById("employeesTable");
    // Clear existing employee table
    employeesTable.innerHTML = "";
    // Filter employees based on the selected department
    const filteredEmployees = employees.filter((employee) => {
      return (
        selectedDepartment === "" ||
        (employee.departmentID &&
          employee.departmentID._id === selectedDepartment)
      );
    });

    // Display filtered employees in the table
    filteredEmployees.forEach(async (employee) => {
      const shifts = await getShiftForEmployee(employee._id);
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><a href="editEmployee.html?id=${employee._id}">${
        employee.firstName
      }</a></td>
        <td>${
          employee.departmentID
            ? `<a href="editDepartment.html?id=${employee.departmentID._id}">${employee.departmentID.name}</a>`
            : "No Department"
        }</td>
        <td>
        ${
          typeof shifts === "string"
            ? shifts
            : shifts
                .map((shift) => {
                  return `<div><i class="calendar alternate outline icon"></i> ${formatDateToCustomFormat(
                    shift.date
                  )} <i class="clock outline icon"></i>${
                    shift.startingHour
                  } - ${shift.endingHour}</div>`;
                })
                .join("")
        }
        </td>
      `;

      // You can fetch and add shifts data in the third column here
      employeesTable.appendChild(row);
    });
  } catch (error) {
    console.log("filterEmployees error:", error);
  }
};

const getAllEmployees = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      "http://localhost:8000/graphql",
      {
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
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          actionCount: localStorage.getItem("actionCount"),
        },
      }
    );
    //console.log("getAllEmployees");
    const { employees } = response.data.data;
    return employees;
  } catch (error) {
    console.error("GraphQL request error getAllEmployees:", error);
  }
};

// Initialize the employee table with all employees
const initEmployeesTable = async () => {
  try {
    const employees = await getAllEmployees();

    filterEmployees("", employees);
  } catch (error) {
    console.error("GraphQL request error:", error);
  }
};
