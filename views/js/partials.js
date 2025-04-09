(() => {
  const pageName = window.location.pathname.split('/').pop()
  const setCopyrightYear = () => {
    document.querySelector("footer>kbd>span").innerHTML =
      new Date().getFullYear()
  }
  async function postData(url = "", data = {}) {
    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    })

    const reply = await response.json()
    return reply
  }

  const register = async (event) => {
    event.preventDefault()
    let name = document.querySelector("#name").value
    let email = document.querySelector("#email").value
    let password = document.querySelector("#password").value
    let confirm = document.querySelector("#confirm").value
    if (password === confirm) {

      let response = await postData("/register", {
        name,
        email,
        password,
        confirm,
      })

      if (response && response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          text: 'You have successfully registered. Redirecting to homepage...',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          window.location.href = "/"
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: response.msg || 'An error occurred. Please try again.',
        })
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Password Mismatch',
        text: 'Passwords do not match. Please re-enter your password.',
      })
    }
  }
  const login = async (event) => {
    event.preventDefault()
    let email = document.querySelector("#lemail").value
    let password = document.querySelector("#lpassword").value

    let response = await postData("/login", {
      email,
      password
    })

    if (response && response.status === 200) {
      if (localStorage.getItem('cart')) {
        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: 'Redirecting to your cart...',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          window.location.href = "/index.html"
        })
      }
      else {
        if (response.userRole == 'admin') {
          Swal.fire({
            icon: 'success',
            title: 'Login Successful!',
            text: 'Redirecting to Admin Dashboard...',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            window.location.href = "/admin-dashboard.html"
          })
        }
        else {
          Swal.fire({
            icon: 'success',
            title: 'Login Successful!',
            text: 'Redirecting to your Dashboard...',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            window.location.href = "/dashboard.html"
          })
        }
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: response.msg || 'An error occurred. Please try again.',
      })
    }
  }

  const checkSession = async () => {
    let response = await fetch("/session-info", {
      method: "GET", 
      headers: {
        "Content-Type": "application/json", 
      },
    })
    let data = await response.json()

    console.log("response=" + JSON.stringify(data))

    if (data && data.status === 200 && data.user) {
      if (pageName == 'place-order.html') {
        document.querySelector("#checkoutName").value = data.user.name
        document.querySelector("#checkoutEmail").value = data.user.email
      }

      document.getElementById('auth-buttons').style.display = 'none'
      document.getElementById('dashboard-btn').style.display = 'block'
      let sidebarResponse = ''
      if (data.user.role == 'admin') {
        sidebarResponse = await fetch("/partials/sidebar.html")
        document.querySelector(".dashboardLink a").href = 'admin-dashboard.html'
      }
      else {
        sidebarResponse = await fetch("/partials/sidebar-user.html")
        document.querySelector(".dashboardLink a").href = 'dashboard.html'
      }

      const sidebarContent = await sidebarResponse.text()
      document.querySelector("#sidebar").innerHTML = sidebarContent

      if (data.user.picture) {
        document.querySelector("#sidePicture").src = data.user.picture
      }
      else {
        document.querySelector("#sidePicture").src = 'https://placehold.co/100x100'
      }

      document.querySelector("#sideName").textContent = data.user.name
      document.querySelector("#sideEmail").textContent = data.user.email
      document.querySelector("#sideRole span").textContent = data.user.role.toUpperCase()

    } else {
      document.getElementById('auth-buttons').style.display = 'block'
      document.getElementById('dashboard-btn').style.display = 'none'
    }
  }

  const loadHeaderFooter = async () => {
    const headerResponse = await fetch("/partials/top.html")
    const headerContent = await headerResponse.text()
    document.querySelector("#top").innerHTML = headerContent

    // adding-top (as much as the header height)
    document.body.style.paddingTop = "80px"   
    
    //console.log("Current Page:", pageName)
    if (pageName == 'index.html' || pageName == 'about.html' || pageName == 'bookify-books.html' || pageName == 'google-books.html' || pageName == 'contact.html') {
      document.getElementById('cart-btn').style.display = 'block'
    }
    else{
      document.getElementById('cart-btn').style.display = 'none'
    }

    const footerResponse = await fetch("/partials/bottom.html")
    const footerContent = await footerResponse.text()
    document.querySelector("#bottom").innerHTML = footerContent
    // setCopyrightYear()

    setTimeout(() => {
      const yearSpan = document.getElementById("year");
      if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
      }
    }, 100);  }

  window.addEventListener('load', () => {

    loadHeaderFooter().then(() => {

      checkSession()
      
      document.querySelector("#registerForm").addEventListener("submit", register)
      document.querySelector("#loginForm").addEventListener("submit", login)

    })
  })
})()
