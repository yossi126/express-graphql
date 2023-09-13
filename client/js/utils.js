export const getUser = async () => {
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
    const { data, errors } = response.data;

    if (errors) {
      // create a alert window at take the user back to the login page and clear history so he can't go back
      alert(errors[0].message);
      window.location.href = "login.html";
      return;
    }

    // Handle the GraphQL response here
    const { user } = response.data.data;
    const fullName = document.getElementById("fullName");
    fullName.textContent = `Welcome ${user.fullName}`;
  } catch (error) {
    console.error("GraphQL request error:", error);
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
};

export const checkAuthentication = () => {
  const token = localStorage.getItem("token");
  //console.log(token);
  if (!token) {
    window.location.href = "login.html"; // Redirect unauthenticated users to the login page
  }
};
