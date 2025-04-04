// using IIFE
(() => {
  /**----------------------------------------------------
    Utility functions
    -----------------------------------------------------*/
  const getJsonData = async (url) => {
    try {
      console.info("getJsonData", url);
      const response = await fetch(url);
      console.info(response);
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  /**----------------------------------------------------
    Utility functions
    -----------------------------------------------------*/
  const getUsers = () => {
    console.info("Getting users");
    fetch("/users")
      .then((response) => response.json())
      .then((posts) => displayUsers(posts))
      .catch((err) => console.error(err));
  };
  const displayUsers = async (users) => {
    if (users.length > 0) {
      console.info("Users:", users);
      let tbody = document.querySelector("#usersData tbody");

      // Clear existing rows in case of re-fetch
      tbody.innerHTML = "";

      users.forEach((user, index) => {
        let tr = document.createElement("tr");

        // Add Sr. No.
        let tdSrNo = document.createElement("td");
        tdSrNo.innerHTML = `<kbd>${index + 1}</kbd>`;
        tr.appendChild(tdSrNo);

        // Add Name
        let tdName = document.createElement("td");
        tdName.textContent = user.name;
        tr.appendChild(tdName);

        // Add Email ID
        let tdEmail = document.createElement("td");
        tdEmail.textContent = user.email;
        tr.appendChild(tdEmail);

        // Add Role
        let tdRole = document.createElement("td");
        tdRole.innerHTML =
          user.role === "member"
            ? '<span class="badge bg-success">Member</span>'
            : user.role === "admin"
            ? '<span class="badge bg-primary">Admin</span>'
            : '<span class="badge bg-warning">Guest</span>';
        tr.appendChild(tdRole);

        // Add Action Button
        let tdAction = document.createElement("td");

        if (user.role != "admin") {
          // Create View Details Button
          let viewBtn = document.createElement("button");
          viewBtn.classList.add("btn", "btn-outline-success", "btn-sm", "me-2"); // "me-2" adds right margin
          viewBtn.innerHTML = '<i class="bi bi-eye"></i>'; // Bootstrap eye icon
          viewBtn.onclick = () => displayUserDetails(user._id);
          tdAction.appendChild(viewBtn);

          // Create Delete Button
          let deleteBtn = document.createElement("button");
          deleteBtn.classList.add("btn", "btn-outline-danger", "btn-sm");
          deleteBtn.innerHTML = '<i class="bi bi-trash"></i>'; // Bootstrap trash icon
          deleteBtn.onclick = () => deleteUser(user._id); // Add your delete function here
          tdAction.appendChild(deleteBtn);
        }
        tr.appendChild(tdAction);
        // Append row to the table body
        tbody.appendChild(tr);
      });
    } else {
      console.info("No users data available");
    }
  };
  const displayUserDetails = async (userId) => {
    // Fetch user details by ID
    const user = await getJsonData(`/user/${userId}`);
    console.info("User details:", user);
    let cardContent = '';
    // Populate the form with user details
    const userDetails = user.user; // Assuming response is an array with a single user object
    Object.keys(userDetails).forEach((key) => {
    //   let element = document.querySelector(`#${key}`);
    //   if (element) {
    //     element.value = userDetails[key];
    //   } else {
    //     document.querySelector(`#${key}`).innerHTML = userDetails[key];
    //   }
    let value = userDetails[key];

        if(key!='_id' && key!='password')
        {
            if(key=='role')
            {
                value =   value === "member"
            ? '<span class="badge bg-success">Member</span>'
            : value === "admin"
            ? '<span class="badge bg-primary">Admin</span>'
            : '<span class="badge bg-warning">Guest</span>';
            }
        cardContent += `
            <p class="card-text">
                <strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> <span id="user${key}">${value}</span>
            </p>
        `;
        }

        



    });
    document.querySelector("#user .card-body").innerHTML = cardContent;
    // Toggle visibility of sections
    document.querySelector("#user").style.display = "block";
    document.querySelector("#users").style.display = "none";
  };

  const deleteUser = async (userId) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        // Send DELETE request to the server
        const response = await fetch(`/user/${userId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          //console.info("User deleted successfully");

          // Re-fetch the users to update the table
          getUsers();
        } else {
          console.error("Failed to delete user", response.statusText);
        }
      } catch (err) {
        console.error("Error while deleting user:", err);
      }
    }
  };

  const viewUsers = async (users) => {
    document.querySelector("#user").style.display = "none";
    document.querySelector("#users").style.display = "block";
  }
  

  window.onload = () => {
    viewUsers()
    getUsers()
    document.querySelector("#viewUsers")?.addEventListener("click", viewUsers);
  };
})();
