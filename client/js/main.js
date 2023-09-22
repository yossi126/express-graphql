import { getUser, logout, checkAuthentication } from "./utils.js";

document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logout");
  const employeesLink = document.getElementById("homeLink");
  // Call the checkAuthentication function when the page loads
  window.onload = checkAuthentication;
  // Add the logout event listener to the logout button
  logoutBtn.addEventListener("click", logout);
  // Add the active class to the employees link
  employeesLink.classList.add("active");
  getUser();
});

checkAuthentication();
