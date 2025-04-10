document.addEventListener("DOMContentLoaded", () => {  
  
    loadGoogleBooksGrid();
  });
  
  async function loadGoogleBooksGrid() {
    try {
      const queries = ["science", "art", "history", "fiction", "novel", "AI", "JavaScript", "travel", "music"];
      const query = queries[Math.floor(Math.random() * queries.length)];
  
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=20`);
      const data = await res.json();
      const books = data.items;
      const container = document.getElementById("googleBooksGrid");
  
      container.innerHTML = "";
  
      books.forEach(book => {
        const info = book.volumeInfo;
        const title = info.title || "No title";
        const authors = info.authors?.join(", ") || "Unknown";
        const thumbnail = info.imageLinks?.thumbnail || "https://placehold.co/200x300";
        const link = info.infoLink || "#";
  
        const col = document.createElement("div");
        col.className = "col-sm-6 col-lg-3 mb-4";
        col.innerHTML = `
          <a href="${link}" target="_blank" style="text-decoration: none; color: inherit;">
            <div class="card h-100 shadow-sm">
              <img src="${thumbnail}" class="card-img-top" alt="${title}">
              <div class="card-body">
                <h6 class="card-title">${title}</h6>
                <p class="card-text"><small>${authors}</small></p>
              </div>
            </div>
          </a>
        `;
        container.appendChild(col);
      });
    } catch (err) {
      console.error("Failed to load Google Books:", err);
    }
  }
  