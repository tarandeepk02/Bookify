// using IIFE
(() => {
  /**----------------------------------------------------
    Utility functions
    -----------------------------------------------------*/
  const getJsonData = async (url) => {
    try {
      console.info("getJsonData", url)
      const response = await fetch(url)
      console.info(response)
      const data = await response.json()
      return data
    } catch (err) {
      console.error(err)
    }
  }

  /**----------------------------------------------------
    Utility functions
    -----------------------------------------------------*/
  const getUsers = () => {
    console.info("Getting users")
    fetch("/users")
      .then((response) => response.json())
      .then((posts) => displayUsers(posts))
      .catch((err) => console.error(err))
  }

  const displayUsers = async (users) => {
    if (users.length > 0) {
      //console.info("Users:", users)
      let tbody = document.querySelector("#usersData tbody")

      tbody.innerHTML = ""

      users.forEach((user, index) => {
        if (user.role != 'admin') {
          let tr = document.createElement("tr")

          // Add Sr. No.
          let tdSrNo = document.createElement("td")
          tdSrNo.innerHTML = `<kbd>${index + 1}</kbd>`
          tr.appendChild(tdSrNo)

          // Add Name
          let tdName = document.createElement("td")
          tdName.textContent = user.name
          tr.appendChild(tdName)

          // Add Email ID
          let tdEmail = document.createElement("td")
          tdEmail.textContent = user.email
          tr.appendChild(tdEmail)

          // Add Role
          let tdRole = document.createElement("td")
          tdRole.innerHTML =
            user.role === "member"
              ? '<span class="badge bg-success">Member</span>'
              : user.role === "admin"
                ? '<span class="badge bg-primary">Admin</span>'
                : '<span class="badge bg-warning">Guest</span>'
          tr.appendChild(tdRole)

          // Add Action Button
          let tdAction = document.createElement("td")

          if (user.role != "admin") {
            // Create View Details Button
            let viewBtn = document.createElement("button")
            viewBtn.classList.add("btn", "btn-outline-success", "btn-sm", "me-2")
            viewBtn.innerHTML = '<i class="bi bi-eye"></i>'
            viewBtn.onclick = () => displayUserDetails(user._id)
            tdAction.appendChild(viewBtn)

            // Create Delete Button
            let deleteBtn = document.createElement("button")
            deleteBtn.classList.add("btn", "btn-outline-danger", "btn-sm")
            deleteBtn.innerHTML = '<i class="bi bi-trash"></i>'
            deleteBtn.onclick = () => deleteUser(user._id)
            tdAction.appendChild(deleteBtn)
          }
          tr.appendChild(tdAction)

          // Append row to the table body
          tbody.appendChild(tr)
        }
      })
    } else {
      //console.info("No users data available")
      let tr = document.createElement("tr")
      let td = document.createElement("td")
      td.colSpan = 6
      td.style.textAlign = "center"
      td.innerHTML = "No users data available"
      tr.appendChild(td)
      tbody.appendChild(tr)
    }
  }

  const displayUserDetails = async (userId) => {
    // Fetch user details by ID
    const user = await getJsonData(`/user/${userId}`)
    //console.info("User details:", user)
    let cardContent = ''
    const userDetails = user.user
    Object.keys(userDetails).forEach((key) => {
      let value = userDetails[key]

      if (key != '_id' && key != 'password') {
        if (key == 'role') {
          value = value === "member"
            ? '<span class="badge bg-success">Member</span>'
            : value === "admin"
              ? '<span class="badge bg-primary">Admin</span>'
              : '<span class="badge bg-warning">Guest</span>'
        }
        else if (key == 'picture') {
          let valueImg
          if (value != '' && value != null) {
            valueImg = value
          }
          else {
            valueImg = 'https://placehold.co/100x100'
          }
          value = '<img src="' + valueImg + '" width="100" height="100">'
        }
        cardContent += `
            <p class="card-text">
                <strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> <span id="user${key}">${value}</span>
            </p>
        `
      }
    })
    document.querySelector("#user .card-body").innerHTML = cardContent
    document.querySelector("#user").style.display = "block"
    document.querySelector("#users").style.display = "none"
  }

  const deleteUser = async (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`/user/${userId}`, {
            method: "DELETE",
          })

          if (response.ok) {
            Swal.fire("Deleted!", "User has been deleted.", "success")
            getUsers()
          } else {
            //console.error("Failed to delete user", response.statusText)
            Swal.fire("Error", "Failed to delete user.", "error")
          }
        } catch (err) {
          //console.error("Error while deleting user:", err)
          Swal.fire("Error", "An error occurred while deleting user.", "error")
        }
      }
    })
  }

  const viewUsers = async (users) => {
    document.querySelector("#user").style.display = "none"
    document.querySelector("#users").style.display = "block"
  }

  window.onload = () => {
    viewUsers()
    getUsers()
    document.querySelector("#viewUsers")?.addEventListener("click", viewUsers)
  }
})()
