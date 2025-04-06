(() => {
  const setCopyrightYear = () => {
    document.querySelector("footer>kbd>span").innerHTML =
      new Date().getFullYear();
  };
  async function postData(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });

    const reply = await response.json();
    //console.log("Datadata="+JSON.stringify(reply)+"response="+reply.status)
    return reply; // parses JSON response into native JavaScript objects
  }

  const register = async (event) => {
    // prevent refreshing the page
    event.preventDefault();
    let name = document.querySelector("#name").value;
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;
    let confirm = document.querySelector("#confirm").value;
    if (password === confirm) {      

      let response = await postData("/register", {
        name,
        email,
        password,
        confirm,
      });

      if (response && response.status === 200) {
        window.location.href = "/"; 
      } else {
        document.querySelector(
          "#signup-error"
        ).innerHTML = `<div class="alert alert-dismissible alert-danger">${
            response.msg || "An error occurred. Please try again."
        }</div>`;
      }
    } else {
      document.querySelector(
        "#signup-error"
      ).innerHTML = `<div class="alert alert-dismissible alert-primary">Passwords do not match. Re-enter your password</div>`;
    }
  };
  const login = async (event) => {
    event.preventDefault();
    let email = document.querySelector("#lemail").value;
    let password = document.querySelector("#lpassword").value;   
    

    let response = await postData("/login", {        
        email,
        password
      });

    console.log("Data=" + JSON.stringify(response));

    if (response && response.status === 200) {
      if(response.userRole=='admin')
      {
        window.location.href = "/admin-dashboard.html"; 
      }
      else{
        window.location.href = "/dashboard.html"; 
      }
      } else {
        document.querySelector(
          "#signup-error"
        ).innerHTML = `<div class="alert alert-dismissible alert-danger">${
            response.msg || "An error occurred. Please try again."
        }</div>`;
      }

  };


  // Check session to toggle login/register and dashboard buttons
  const checkSession = async () => {
    let response = await fetch("/session-info", {
        method: "GET", // Use GET method
        headers: {
          "Content-Type": "application/json", // If necessary
        },
      });
      let data = await response.json();

      console.log("response=" + JSON.stringify(data));

    if (data && data.status === 200 && data.user) {
      // User is logged in, show dashboard button and hide login/register
      document.getElementById('auth-buttons').style.display = 'none';
      document.getElementById('dashboard-btn').style.display = 'block';
      let sidebarResponse = ''
      if(data.user.role=='admin')
      {
        sidebarResponse = await fetch("/partials/sidebar.html")
        document.querySelector(".dashboardLink a").href = 'admin-dashboard.html'
      }
      else{
        sidebarResponse = await fetch("/partials/sidebar-user.html")
        document.querySelector(".dashboardLink a").href = 'dashboard.html'
      }
      
      
    const sidebarContent = await sidebarResponse.text();
    document.querySelector("#sidebar").innerHTML = sidebarContent;

    if(data.user.picture)
    {
      document.querySelector("#sidePicture").src = data.user.picture

    }
    else{
      document.querySelector("#sidePicture").src = 'https://placehold.co/100x100'

    }

    document.querySelector("#sideName").textContent = data.user.name
      document.querySelector("#sideEmail").textContent = data.user.email
      document.querySelector("#sideRole span").textContent = data.user.role.toUpperCase()

    } else {
      // User is not logged in, show login/register buttons
      document.getElementById('auth-buttons').style.display = 'block';
      document.getElementById('dashboard-btn').style.display = 'none';
    }
  };

  // Function to load and inject the header and footer HTML
  const loadHeaderFooter = async () => {
    // Load header content dynamically
    const headerResponse = await fetch("/partials/top.html");
    const headerContent = await headerResponse.text();
    document.querySelector("#top").innerHTML = headerContent;

    // Load footer content dynamically
    const footerResponse = await fetch("/partials/bottom.html");
    const footerContent = await footerResponse.text();
    document.querySelector("#bottom").innerHTML = footerContent;
    setCopyrightYear();
  };

  window.addEventListener('load', () => {
    // Load the header and footer content

    loadHeaderFooter().then(() => {

      checkSession()
      // Attach event listeners after the content is fully loaded
      document.querySelector("#signup")?.addEventListener("click", register);
      document.querySelector("#signin")?.addEventListener("click", login);

    });
  });
})();
