function trackUserAction(numOfActions) {
  let actionCount = parseInt(localStorage.getItem("actionCount"));
  if (actionCount === numOfActions) {
    console.log("riched the limit");
  }
  actionCount++;
  localStorage.setItem("actionCount", actionCount);
}

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
      console.log(errors);
      // create a alert window at take the user back to the login page and clear history so he can't go back
      alert(errors[0].message);
      window.location.href = "login.html";
      return;
    }

    trackUserAction(data.user.numOfActions);

    // Handle the GraphQL response here
    const { user } = response.data.data;
    const fullName = document.getElementById("fullName");
    fullName.textContent = `Welcome ${user.fullName}`;
  } catch (error) {
    console.error("GraphQL request error:", error);
  }
};

export const logout = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      "http://localhost:8000/graphql",
      {
        query: `
        query{
          logout
      }
            `,
      },
      {
        headers: {
          actionCount: localStorage.getItem("actionCount"),
          token: token,
        },
      }
    );
    let actionCount = parseInt(localStorage.getItem("actionCount"));
    actionCount--;
    localStorage.setItem("actionCount", actionCount);
    console.log(actionCount);

    localStorage.removeItem("token");
    localStorage.removeItem("actionCount");

    window.location.href = "login.html";
  } catch (error) {
    console.log("logout error:", error);
  }
};

export const checkAuthentication = () => {
  const token = localStorage.getItem("token");
  // console.log("checkAuthentication");
  if (!token) {
    window.location.href = "login.html"; // Redirect unauthenticated users to the login page
  }
};
