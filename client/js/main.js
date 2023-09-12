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

  const employeesLink = document.getElementById("homeLink");
  employeesLink.classList.add("active");
});

// main.js
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
