document.addEventListener("DOMContentLoaded", function () {
  const getUser = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:8000/graphql",
        {
          query: `
                {
                  user {
                    fullName
                  }
                }
              `,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle the GraphQL response here

      const { user } = response.data.data;
      const fullName = document.getElementById("fullName");
      fullName.textContent = `Welcome ${user.fullName}`;
    } catch (error) {
      console.error("GraphQL request error:", error);
    }
  };

  getUser();
  createEmployeesForTable();

  const employeesLink = document.getElementById("employeesLink");
  employeesLink.classList.add("active");
});

// return to login.js
function checkAuthentication() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html"; // Redirect unauthenticated users to the login page
  }
}

const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
};

// Call the checkAuthentication function when the page loads
window.onload = checkAuthentication;

const createEmployeesForTable = async () => {
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

    // get the data from the response
    const { employees } = response.data.data;
    // get the table
    const employeesTable = document.getElementById("employeesTable");
    // loop through the employees and create the table rows
    employees.forEach(async (employee) => {
      // create the table row
      const tr = document.createElement("tr");
      // create the table cells for the firstName
      const td1 = document.createElement("td");
      // create employee.firstName as a link to editEmployee.html page with the employee id
      const a = document.createElement("a");
      a.href = `editEmployee.html?id=${employee._id}`;
      a.textContent = employee.firstName;
      td1.appendChild(a);

      // create the table cells for the department
      const td2 = document.createElement("td");
      const a2 = document.createElement("a");
      // if the employee has no department yet create a simple string
      if (employee.departmentID === null) {
        employee.departmentID = { name: "No department yet" };
        a2.textContent = employee.departmentID.name;
        td2.appendChild(a2);
        //else create a link to editDepartment.html page with the department id
      } else {
        a2.href = `editDepartment.html?id=${employee.departmentID._id}`;
        a2.textContent = employee.departmentID.name;
        td2.appendChild(a2);
      }

      // create the table cells for the shifts
      const td3 = document.createElement("td");
      try {
        // get the shifts for the employee by his id
        const shifts = await getShiftForEmployee(employee._id);
        if (typeof shifts === "string") {
          td3.innerHTML = shifts;
        } else {
          td3.innerHTML = shifts
            .map((shift) => {
              return `<div>${shift.date} ${shift.startingHour} - ${shift.endingHour}</div>`;
            })
            .join("");
        }
      } catch (error) {
        td3.innerHTML = "An error occurred";
      }
      // append the table cells to the table row
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      // append the table row to the table
      employeesTable.appendChild(tr);
    });
  } catch (error) {
    console.error("GraphQL request error:", error);
  }
};

const getShiftForEmployee = async (id) => {
  try {
    const response = await axios.post("http://localhost:8000/graphql", {
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
    });

    const { data, errors } = response.data;

    if (errors) {
      return errors[0].message;
    }

    const { employeeShifts } = data;
    return employeeShifts;
  } catch (error) {
    console.log("Network error:", error);
    return error;
  }
};
