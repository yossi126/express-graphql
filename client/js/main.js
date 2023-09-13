import { getUser, logout, checkAuthentication } from "./utils.js";

const logoutBtn = document.getElementById("logout");
const employeesLink = document.getElementById("homeLink");

document.addEventListener("DOMContentLoaded", function () {
  // Call the checkAuthentication function when the page loads
  window.onload = checkAuthentication;
  // Add the logout event listener to the logout button
  logoutBtn.addEventListener("click", logout);
  // Add the active class to the employees link
  employeesLink.classList.add("active");
  getUser();
});

checkAuthentication();
