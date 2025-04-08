async function loadBooks(book,container) {
  const card = document.createElement("div");
  card.className = "col-md-3 mb-4";
  const cart = loadCart(); 
  const isInCart = cart.some(item => item.id === book._id);

  card.innerHTML = `
    <div class="card h-100 shadow-sm">
      <img src="${book.coverImage}" class="card-img-top" alt="${book.title}" style="height:200px; object-fit:cover;">
      <div class="card-body">
        <h5 class="card-title">${book.title}</h5>
        <p class="card-text"><small>${book.authors}</small></p>
        </div>
        <div class="card-footer d-flex justify-content-end gap-1">
        <a href="book-details.html?id=${book._id}" class="btn btn-dark btn-sm"><i class="bi bi-eye"></i> View</a>
        <button class="btn btn-primary btn-sm add-to-cart" data-id="${book._id}" data-title="${book.title}" data-author="${book.authors}" data-price="${book.price}" data-image="${book.coverImage}" onclick="handleAddToCart(this)" ${isInCart ? 'disabled' : ''}><i class="bi bi-cart"></i> ${isInCart ? 'Added to Cart' : 'Add to Cart'}</button>        
      
        </div>
    </div>
  `;
  container.appendChild(card);
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
      // 1. loading from MongoDB
      const res = await fetch("/books");
      const books = await res.json();
      const limitedBooks = books.slice(0, 8);
      const container = document.getElementById("bookCards");
  
      limitedBooks.forEach(book => {
        loadBooks(book,container)
      }); 
      
      const allBooks = books;
      const container1 = document.getElementById("bookCardsAll");
  
      allBooks.forEach(book => {
        loadBooks(book,container1)
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
  