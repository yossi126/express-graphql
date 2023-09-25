// function that track the user actions and check if he reached the limit in one enty for the website
async function trackUserAction(numOfActions) {
  let actionCount = parseInt(localStorage.getItem("actionCount"));
  actionCount++;
  localStorage.setItem("actionCount", actionCount);
  // if the user reach the limit of actions in one entry for the website
  if (actionCount === numOfActions) {
    alert("You reached your actions limit for today");
    await logout();
    localStorage.removeItem("token");
    localStorage.removeItem("actionCount");
  }
  return actionCount;
}

//get the current user from the server
export const getUser = async () => {
  const currentURL = window.location.href;
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
      // create an alert window and take the user back to the login page and clear history so he can't go back
      alert(errors[0].message);
      window.location.href = "login.html";
      return;
    }

    const actionsLeft = await trackUserAction(data.user.numOfActions);
    const { user } = response.data.data;
    const fullName = document.getElementById("fullName");
    fullName.textContent = `Welcome ${user.fullName}`;
    //fullName.id = `${user.fullName} `;
    return user;
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

export function formatDateToCustomFormat(dateString) {
  const inputDate = new Date(dateString);
  if (!isNaN(inputDate)) {
    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, "0");
    const day = String(inputDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return ""; // Return an empty string if the input date is invalid
}
