// (() => {
//   const setCopyrightYear = () => {
//     document.querySelector("footer>kbd>span").innerHTML =
//       new Date().getFullYear();
//   };
//   async function postData(url = "", data = {}) {
//     // Default options are marked with *
//     const response = await fetch(url, {
//       method: "POST", // *GET, POST, PUT, DELETE, etc.
//       mode: "cors", // no-cors, *cors, same-origin
//       cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
//       credentials: "same-origin", // include, *same-origin, omit
//       headers: {
//         "Content-Type": "application/json",
//         // 'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       redirect: "follow", // manual, *follow, error
//       referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
//       body: JSON.stringify(data), // body data type must match "Content-Type" header
//     });

//     const reply = await response.json();
//     //console.log("Datadata="+JSON.stringify(reply)+"response="+reply.status)
//     return reply; // parses JSON response into native JavaScript objects
//   }

//   const register = async (event) => {
//     // prevent refreshing the page
//     event.preventDefault();
//     let name = document.querySelector("#name").value;
//     let email = document.querySelector("#email").value;
//     let password = document.querySelector("#password").value;
//     let confirm = document.querySelector("#confirm").value;
//     if (password === confirm) {      

//       let response = await postData("/register", {
//         name,
//         email,
//         password,
//         confirm,
//       });

//       if (response && response.status === 200) {
//         window.location.href = "/"; 
//       } else {
//         document.querySelector(
//           "#signup-error"
//         ).innerHTML = `<div class="alert alert-dismissible alert-danger">${
//             response.msg || "An error occurred. Please try again."
//         }</div>`;
//       }
//     } else {
//       document.querySelector(
//         "#signup-error"
//       ).innerHTML = `<div class="alert alert-dismissible alert-primary">Passwords do not match. Re-enter your password</div>`;
//     }
//   };
//   const login = async (event) => {
//     event.preventDefault();
//     let email = document.querySelector("#lemail").value;
//     let password = document.querySelector("#lpassword").value;   
    

//     let response = await postData("/login", {        
//         email,
//         password
//       });

//     console.log("Data=" + JSON.stringify(response));

//     if (response && response.status === 200) {
//         window.location.href = "/admin-dashboard.html"; 
//       } else {
//         document.querySelector(
//           "#signup-error"
//         ).innerHTML = `<div class="alert alert-dismissible alert-danger">${
//             response.msg || "An error occurred. Please try again."
//         }</div>`;
//       }

//   };


//   // Check session to toggle login/register and dashboard buttons
//   const checkSession = async () => {
//     let response = await fetch("/session-info", {
//         method: "GET", // Use GET method
//         headers: {
//           "Content-Type": "application/json", // If necessary
//         },
//       });
//       let data = await response.json();

//       //console.log("response=" + JSON.stringify(data));

//     if (data && data.status === 200 && data.user) {
//       // User is logged in, show dashboard button and hide login/register
//       document.getElementById('auth-buttons').style.display = 'none';
//       document.getElementById('dashboard-btn').style.display = 'block';


//       const sidebarResponse = await fetch("/partials/sidebar.html");
//     const sidebarContent = await sidebarResponse.text();
//     document.querySelector("#sidebar").innerHTML = sidebarContent;


//     } else {
//       // User is not logged in, show login/register buttons
//       document.getElementById('auth-buttons').style.display = 'block';
//       document.getElementById('dashboard-btn').style.display = 'none';
//     }
//   };

//   // Function to load and inject the header and footer HTML
//   const loadHeaderFooter = async () => {
//     // Load header content dynamically
//     const headerResponse = await fetch("/partials/top.html");
//     const headerContent = await headerResponse.text();
//     document.querySelector("#top").innerHTML = headerContent;

//     // Load footer content dynamically
//     const footerResponse = await fetch("/partials/bottom.html");
//     const footerContent = await footerResponse.text();
//     document.querySelector("#bottom").innerHTML = footerContent;
//     setCopyrightYear();
//   };

//   window.onload = () => {
//     // Load the header and footer content

//     loadHeaderFooter().then(() => {

//       checkSession()
//       // Attach event listeners after the content is fully loaded
//       document.querySelector("#signup")?.addEventListener("click", register);
//       document.querySelector("#signin")?.addEventListener("click", login);

//     });
//   };
// })();
document.addEventListener("DOMContentLoaded", async () => {
    try {
      // 1. loading from MongoDB
      const res = await fetch("/books");
      const books = await res.json();
      const limitedBooks = books.slice(0, 8);
      const container = document.getElementById("bookCards");
  
      limitedBooks.forEach(book => {
        const card = document.createElement("div");
        card.className = "col-md-3 mb-4";
  
        card.innerHTML = `
          <div class="card h-100 shadow-sm">
            <img src="${book.coverImage}" class="card-img-top" alt="${book.title}" style="height:200px; object-fit:cover;">
            <div class="card-body">
              <h5 class="card-title">${book.title}</h5>
              <p class="card-text"><small>${book.authors}</small></p>
              <a href="book-details.html?id=${book._id}" class="btn btn-primary btn-sm">View Details</a>
            </div>
          </div>
        `;
        container.appendChild(card);
      });
  
      // 2. Google Books Carousel
      await loadGoogleBooksCarousel();
  
    } catch (error) {
      console.error("fail to read book data.", error);
    }
  });
  
  async function loadGoogleBooksCarousel() {
    try {
      // random keyword 
      const queries = ["fiction", "science", "travel", "romance", "history", "fantasy", "javascript", "ai", "art"];
      const query = queries[Math.floor(Math.random() * queries.length)];
  
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=9`);
      const data = await res.json();
      const books = data.items;
      console.log("Google Books:", books);
  
      const container = document.getElementById("googleBooksInner");
      container.innerHTML = "";
  
      const cardsPerSlide = 3;
  
      for (let i = 0; i < books.length; i += cardsPerSlide) {
        const item = document.createElement("div");
        item.className = `carousel-item ${i === 0 ? "active" : ""}`;
  
        const row = document.createElement("div");
        row.className = "row justify-content-center";
  
        for (let j = i; j < i + cardsPerSlide && j < books.length; j++) {
          const volume = books[j].volumeInfo;
          const title = volume.title || "No title";
          const thumbnail = volume.imageLinks?.thumbnail || "https://placehold.co/200x300";
          const authors = volume.authors?.join(", ") || "Unknown";
          const infoLink = volume.infoLink || "#";
  
          const col = document.createElement("div");
          col.className = "col-md-3 mx-2";
  
          col.innerHTML = `
            <a href="${infoLink}" target="_blank" style="text-decoration: none; color: inherit;">
              <div class="card shadow-sm">
                <img src="${thumbnail}" class="card-img-top" alt="${title}" style="height:300px; object-fit:cover;">
                <div class="card-body">
                  <h6 class="card-title">${title}</h6>
                  <p class="card-text"><small>${authors}</small></p>
                </div>
              </div>
            </a>
          `;
  
          row.appendChild(col);
        }
  
        item.appendChild(row);
        container.appendChild(item);
      }
    } catch (err) {
      console.error("Fail to read Google Books", err);
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    loadGoogleBooksCarousel();
  });
  