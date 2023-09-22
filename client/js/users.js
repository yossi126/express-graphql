import { getUser, logout, checkAuthentication } from "./utils.js";

document.addEventListener("DOMContentLoaded", async function () {
  const logoutBtn = document.getElementById("logout");
  const usersLink = document.getElementById("usersLink");

  usersLink.classList.add("active");
  logoutBtn.addEventListener("click", logout);
  getUser();
  window.onload = checkAuthentication();
});
