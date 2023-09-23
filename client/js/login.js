const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");
errorMessage.style.display = "none";

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;

  try {
    // Send a GraphQL request to your server
    const response = await axios.post("http://localhost:8000/graphql", {
      query: `
              query login($userName: String, $email: String) {
                  login(userName: $userName, email: $email) {
                      userId
                      token
                      tokenExpiration
                  }
              }
          `,
      variables: {
        userName: username,
        email: email,
      },
    });

    // Handle the response
    const {
      data: {
        data: { login },
      },
    } = response;

    if (login) {
      const token = login.token;

      localStorage.setItem("token", token);
      //create a defult action count veraible in local storage
      localStorage.setItem("actionCount", 0);
      document.getElementById("username").value = "";
      document.getElementById("email").value = "";
      redirectToMain();
    } else {
      // Invalid credentials or other error
      console.log(response.data.errors[0].message);
      setErrorMsg(response.data.errors[0].message);
    }
  } catch (error) {
    console.error("Login error:", error);
    errorMessage.textContent =
      "An error occurred during login. Please try again.";
  }
});

function redirectToMain() {
  // Redirect to the "main.html" page in the same folder
  window.location.href = "main.html";
}

const setErrorMsg = (error) => {
  errorMessage.textContent = error;
  errorMessage.style.display = "block";
  const interval = setInterval(() => {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
    clearInterval(interval);
  }, 3000);
};
