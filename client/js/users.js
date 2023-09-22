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
    console.log(users);
    return users;
  } catch (error) {
    console.log("Network error:", error);
    return error;
  }
};

const populateUsersTable = async () => {
  const users = await getAllUsers();
  const tableBody = document.getElementById("usersTable");
  let tableBodyHtml = "";

  users.forEach((user) => {
    tableBodyHtml += `
    <tr>
      <td>${user._id}</td>
      <td>${user.fullName}</td>
      <td>${user.numOfActions}</td>
    </tr>
    `;
  });

  tableBody.innerHTML = tableBodyHtml;
};
