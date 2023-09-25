import { getUser, logout, checkAuthentication } from "./utils.js";

document.addEventListener("DOMContentLoaded", async function () {
  const logoutBtn = document.getElementById("logout");
  const usersLink = document.getElementById("usersLink");

  usersLink.classList.add("active");
  logoutBtn.addEventListener("click", logout);

  getUser();
  populateUsersTable();
  window.onload = checkAuthentication();
});

const getAllUsers = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      "http://localhost:8000/graphql",
      {
        query: `
        query{
          users{
              _id
              fullName
              numOfActions
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

    const { data, errors } = response.data;

    if (errors) {
      return errors[0].message;
    }

    const { users } = data;
    // sort by the id descending
    users.sort((a, b) => a._id - b._id);

    return users;
  } catch (error) {
    console.log("Network error:", error);
    return error;
  }
};

const getCurrentActionsForUser = async (userId) => {
  try {
    const response = await axios.post("http://localhost:8000/graphql", {
      query: `
        query{
          currentActions(userId: ${userId})
      }
    `,
    });

    return response.data.data.currentActions;
  } catch (error) {
    console.log("getCurrentActionsForUser error:", error);
  }
};

const populateUsersTable = async () => {
  const users = await getAllUsers();
  const tableBody = document.getElementById("usersTable");

  const hyperlinkTag = document.getElementById("fullName");
  const parts = hyperlinkTag.textContent.split(" ");
  const name = parts.slice(1).join(" ");

  // Create an array of promises to fetch current actions for all users
  const currentActionsPromises = users.map((user) =>
    getCurrentActionsForUser(user._id)
  );

  // Wait for all currentActionsPromises to resolve
  const currentActionsResults = await Promise.all(currentActionsPromises);

  let tableBodyHtml = "";
  users.forEach((user, index) => {
    const currentActions = currentActionsResults[index];
    if (user.fullName === name) {
      tableBodyHtml += `
      <tr class="positive">
        <td> <strong><i class="icon checkmark"></i>${user._id}</strong></td>
        <td> <strong>${user.fullName}</strong></td>
        <td> <strong>${user.numOfActions}</strong></td>
        <td> <strong>${currentActions}</strong></td>
      </tr> 
      `;
      return;
    } else {
      tableBodyHtml += `
      <tr>
        <td>${user._id}</td>
        <td>${user.fullName}</td>
        <td>${user.numOfActions}</td>
        <td>${currentActions}</td>
      </tr>
      `;
    }
  });

  tableBody.innerHTML = tableBodyHtml;
};
