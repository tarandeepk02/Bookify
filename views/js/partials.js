// using IIFE
(() => {    
    const setCopyrightYear = () => {
        document.querySelector('footer>kbd>span').innerHTML = new Date().getFullYear()
    }
    const setHead = () => {
        let head = `<meta charset="UTF-8" />\n
        <meta http-equiv="X-UA-Compatible"/>\n
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n
        <title>Using MongoDB</title>\n
        <link rel="stylesheet" href="css/vapor.min.css" />\n
        <link rel="shortcut icon" href="img/question.png" type="image/x-icon" />\n`
        document.querySelector('head').innerHTML = head
    }
    const setNavbar = () => {
        let navbar = `<nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid" role="banner">
          <img src="img/question.png" class="img-responsive rrounded" alt="Bootstrap Logo" width="50" />
          <a class="navbar-brand" href="#">Langara Forum</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="index.html">Home</a>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
                  aria-expanded="false">
                  Member
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
      
                  <li>
                    <a class="dropdown-item" href="posts.html">Posts</a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="filter.html">Filter Posts</a>
                  </li>
                  <li>
                    <hr class="dropdown-divider" />
                  </li>
                  <li>
                    <a class="dropdown-item" href="search,html">Search Posts</a>
                  </li>
                 
                </ul>
              </li>
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="about.html">About Us</a>
              </li>
            </ul>
            
              <div class="btn-group" role="group" aria-label="Registration and Login" id="aa">
              <button class="btn btn-warning" id="register">
                Register
              </button>
              <button class="btn btn-primary" id="login">
                Log in
              </button></div>
              
            
          </div>
        </div>
      </nav>`
        document.querySelector("header#header").innerHTML = navbar
    }
    const setFooter = () => {
        let footer = `<footer class="footer text-center">\n
    <kbd role="contentinfo">&copy; <span></span>. M. Bouguerra. All rights reserved</kbd>\n
</footer>`
        document.querySelector("div#footer").innerHTML = footer
    }
    //window.onload = () => {
        setHead()
        setNavbar()
        setFooter()
        setCopyrightYear()     

    //}
})()