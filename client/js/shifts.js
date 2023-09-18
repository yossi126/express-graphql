import { getUser, logout, checkAuthentication } from "./utils.js";

document.getElementById("editShiftDate").disabled = true;

document.addEventListener("DOMContentLoaded", async function () {
  const logoutBtn = document.getElementById("logout");
  const shiftsLink = document.getElementById("shiftsLink");
  const createNewShiftForm = document.getElementById("createNewShiftForm");
  const toggle = document.getElementById("select-shifts");
  const checkboxesDiv = document.getElementById("checkboxes-div");
  const checkboxesDivForOtherEmployees =
    document.getElementById("checkboxes-div2");
  const msgToRemove = document.getElementById("message-to-remove");
  const alertForAvailabeEmployees = document.getElementById(
    "alert-for-no-employees"
  );
  const editShiftForm = document.getElementById("editShiftForm");

  //log out button
  logoutBtn.addEventListener("click", logout);
  // add active class to the current button (highlight it)
  shiftsLink.classList.add("active");
  getUser();
  toggleFormVisibility();
  //check unauthenticated users
  window.onload = checkAuthentication();
  // select the option (date) from the dropdown

  toggle.addEventListener("change", async (event) => {
    console.log("select shift up");
    //start popolate the inputs with the shift data
    const editShiftDate = document.getElementById("editShiftDate");
    const editShiftStart = document.getElementById("editShiftStart");
    const editShiftEnd = document.getElementById("editShiftEnd");
    msgToRemove.innerHTML = "Shift employee. Select to remove:";
    toggleFormVisibility();
    //get the shiftId from the element
    const shiftId = event.target.value;
    if (shiftId === "select shift") {
      console.log("select shift");
      document.getElementById("editShiftDate").disabled = true;
      return;
    }

    //if there is no sift there is nothing to display
    const shiftData = await getShiftById(shiftId);
    if (!shiftData) return;

    // if shiftData exists, populate the inputs with the shift data
    editShiftDate.value = formatDateToCustomFormat(+shiftData.date);
    editShiftStart.value = shiftData.startingHour;
    editShiftEnd.value = shiftData.endingHour;

    //in this promise we will get the shift data with existing employees
    // by nowing which exist employees there are, i can get all other employees
    //both exist and aviailable employees will display in checkboxes for remove / save them in the shift
    await getShiftById(shiftId).then(async (shift) => {
      const alertForNoEmployees = document.getElementById(
        "alert-for-no-employees"
      );

      //clear the elements when reload so there will be not duplicates
      checkboxesDiv.innerHTML = "";
      alertForNoEmployees.innerHTML = "";
      checkboxesDivForOtherEmployees.innerHTML = "";

      msgToRemove.innerHTML = "Shift employee. Select to remove:";
      //if there is no employees in the shift, display all the employees in the checkboxes
      if (shift.userId.length === 0) {
        alertForNoEmployees.innerHTML =
          "No users assigned to this shift. Select to add:";
        msgToRemove.innerHTML = "";

        const employees = await getAllEmployees();
        employees.forEach((user, index) => {
          // Use index to create unique IDs
          const input = document.createElement("input");
          input.type = "checkbox";
          input.classList.add("btn-check");
          input.id = `checkbox-${index}`; // Unique ID for each checkbox
          input.autocomplete = "off";
          input.dataset.availableId = user._id;
          const label = document.createElement("label");
          label.classList.add("btn", "btn-outline-primary");
          label.htmlFor = `checkbox-${index}`; // Matching unique ID
          label.innerText = user.firstName;
          //applay the elements in the div container
          checkboxesDivForOtherEmployees.appendChild(input);
          checkboxesDivForOtherEmployees.appendChild(label);
        });

        return;
      }

      //creating checkboxes for each user
      shift.userId.forEach((user, index) => {
        // Use index to create unique IDs
        //console.log(user._id);
        const input = document.createElement("input");
        input.type = "checkbox";
        input.classList.add("btn-check");
        input.id = `checkbox-${index}`; // Unique ID for each checkbox
        input.dataset.existId = user._id;
        input.autocomplete = "off";
        const label = document.createElement("label");
        label.classList.add("btn", "btn-outline-primary");
        label.htmlFor = `checkbox-${index}`; // Matching unique ID
        label.innerText = user.firstName;
        //applay the elements in the div container
        checkboxesDiv.appendChild(input);
        checkboxesDiv.appendChild(label);
      });

      //get all the employees that arent in the shift and put them on checkboxes
      const employees = await getAllEmployees();
      const currentEmployeesInShift = shift.userId;
      // Get all employees not in currentEmployeesInShift based on their _id
      const otherEmployees = employees.filter((employee) => {
        if (currentEmployeesInShift === null) return true; // Include employees with null departmentID
        return !currentEmployeesInShift.some(
          (filteredEmployee) => filteredEmployee._id === employee._id
        );
      });
      otherEmployees.innerHTML = "";
      alertForAvailabeEmployees.innerHTML =
        "Available employees. Select to add:";
      otherEmployees.forEach((user, index) => {
        // Use index to create unique IDs
        const input = document.createElement("input");
        input.type = "checkbox";
        input.classList.add("btn-check");
        input.id = `checkbox-${index}-${index}`; // Unique ID for each checkbox
        input.dataset.availableId = user._id;
        input.autocomplete = "off";

        const label = document.createElement("label");
        label.classList.add("btn", "btn-outline-primary");
        label.htmlFor = `checkbox-${index}-${index}`; // Matching unique ID
        label.innerText = user.firstName;
        //applay the elements in the div container
        checkboxesDivForOtherEmployees.appendChild(input);
        checkboxesDivForOtherEmployees.appendChild(label);
      });
    });

    editShiftForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      //todo - go back for this later , too messy
      await updateShift(
        shiftId,
        editShiftDate.value,
        editShiftStart.value,
        editShiftEnd.value
      );

      alert("Shift updated successfully");
      window.location.replace("./shifts.html");
    });

    document
      .getElementById("removeEmployeesForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();

        // get all the check boxes with the exist employees
        const existsEmployeeCheckbox = document.querySelectorAll(
          "#checkboxes-div input[type=checkbox]"
        );

        //create arrays for the exist and available employees id's
        const existEmployeesId = [];

        // populate the arrays
        existsEmployeeCheckbox.forEach((checkbox) => {
          if (checkbox.checked) {
            existEmployeesId.push(checkbox.dataset.existId);
          }
        });
        await removeEmployeesFromShift(shiftId, existEmployeesId);
        alert("removeEmployeesFromShift");
        window.location.replace("./shifts.html");
      });

    document
      .getElementById("addEmployeesForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();

        // get all the check boxes with the available employees
        const availableEmployeeCheckbox = document.querySelectorAll(
          "#checkboxes-div2 input[type=checkbox]"
        );

        const availableEmployeesId = [];
        availableEmployeeCheckbox.forEach((checkbox) => {
          if (checkbox.checked) {
            availableEmployeesId.push(checkbox.dataset.availableId);
          }
        });

        await addEmployeesFromShift(shiftId, availableEmployeesId);
        alert("addEmployeesFromShift");
        window.location.replace("./shifts.html");
      });
  });

  const getShiftById = async (shiftId) => {
    const responseShift = await axios.post("http://localhost:8000/graphql", {
      query: `

        query($shiftId: String){
          shift(id: $shiftId){
            _id
            date
            startingHour
            endingHour
            userId {
              _id
              firstName
            } 
          }
        } 
      `,
      variables: {
        shiftId: shiftId,
      },
    });
    return responseShift.data.data.shift;
  };

  createNewShiftForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const shiftDate = document.getElementById("shiftDate");
    const shiftStartTime = document.getElementById("shiftStart");
    const shiftEndTime = document.getElementById("shiftEnd");
    try {
      await axios.post("http://localhost:8000/graphql", {
        query: `
        mutation($shiftInput: ShiftInput){
          createShift(shiftInput: $shiftInput)
        }
      `,
        variables: {
          shiftInput: {
            date: new Date(shiftDate.value).toISOString(),
            startingHour: +shiftStartTime.value,
            endingHour: +shiftEndTime.value,
          },
        },
      });

      alert("Shift created successfully");
      window.location.replace("./shifts.html");
    } catch (error) {
      console.log(`createNewShift error: ${error}`);
      throw error;
    }
  });
  async function toggleFormVisibility() {
    const selectElement = document.querySelector(".form-select");
    const formElements = document.querySelectorAll(
      "#editShiftForm input, #editShiftForm select, #editSubmit"
    );

    if (selectElement.value !== "option-shift") {
      // Enable the form elements
      formElements.forEach((element) => {
        // console.log("not dis");
        // console.log(selectElement.value);
        element.disabled = false;
      });
    } else {
      // Disable the form elements
      formElements.forEach((element) => {
        // console.log("dis");
        // console.log(selectElement.value);
        element.disabled = true;
      });
    }
  }
  const popolateShiftstoOptions = async () => {
    try {
      const allShifts = await getAllShifts();
      const selectElement = document.querySelector(".form-select");
      allShifts.forEach((shift) => {
        const option = document.createElement("option");
        option.value = shift._id;
        option.text = formatDateToCustomFormat(shift.date);
        selectElement.appendChild(option);
      });
    } catch (error) {}
  };
  const getAllShifts = async () => {
    const responseShifts = await axios.post("http://localhost:8000/graphql", {
      query: `
        {
           shifts{
             _id
             date
             startingHour
             endingHour
            }
         }
          `,
    });
    return responseShifts.data.data.shifts;
  };
  popolateShiftstoOptions();
  //for format the date from iso to yyyy-mm-dd so it could display on the screen
  function formatDateToCustomFormat(dateString) {
    const inputDate = new Date(dateString);
    if (!isNaN(inputDate)) {
      const year = inputDate.getFullYear();
      const month = String(inputDate.getMonth() + 1).padStart(2, "0");
      const day = String(inputDate.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    return ""; // Return an empty string if the input date is invalid
  }

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

  const updateShift = async (id, date, start, end) => {
    try {
      const response = await axios.post("http://localhost:8000/graphql", {
        query: `mutation($id: String, $shift:ShiftInput){
      updateShift(id:$id,shift: $shift)
      }
    `,
        variables: {
          id: id,
          shift: {
            date: date,
            startingHour: +start,
            endingHour: +end,
          },
        },
      });

      return response.data.data.updateShift;
    } catch (error) {
      return error.message;
    }
  };
  const removeEmployeesFromShift = async (shiftId, employeeArr) => {
    try {
      const response = await axios.post("http://localhost:8000/graphql", {
        query: `mutation($shiftId: String, $employeeIds:[String]){
      removeEmployeesFromShift(shiftId:$shiftId,employeeIds: $employeeIds)
      }
    `,
        variables: {
          shiftId: shiftId,
          employeeIds: employeeArr,
        },
      });

      return response.data.data.removeEmployeesFromShift;
    } catch (error) {
      return error.message;
    }
  };

  const addEmployeesFromShift = async (shiftId, employeeArr) => {
    try {
      const response = await axios.post("http://localhost:8000/graphql", {
        query: `mutation($shiftId: String, $employeeIds:[String]){
      addEmployeesFromShift(shiftId:$shiftId,employeeIds: $employeeIds)
      }
    `,
        variables: {
          shiftId: shiftId,
          employeeIds: employeeArr,
        },
      });

      return response.data.data.addEmployeesFromShift;
    } catch (error) {
      return error.message;
    }
  };
});
