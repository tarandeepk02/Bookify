// js/book-details.js
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const bookId = params.get("id");

  if (!bookId) return;

  try {
    const res = await fetch(`/book/${bookId}`);
    const data = await res.json();
    const book = data.book;

    const container = document.getElementById("bookDetails");
    container.innerHTML = `
      <div class="col-md-4">
        <img src="${book.coverImage}" alt="${book.title}" class="img-fluid rounded shadow">
      </div>
      <div class="col-md-8">
        <h2>${book.title}</h2>
        <p><strong>Author:</strong> ${book.authors}</p>
        <p><strong>ISBN:</strong> ${book.isbn}</p>
        <p><strong>Publisher:</strong> ${book.publisher}</p>
        <p><strong>Genre:</strong> ${book.genre}</p>
        <p><strong>Published:</strong> ${book.publishedDate || "N/A"}</p>
        <p><strong>Price:</strong> $${book.price}</p>
        <p><strong>Rating:</strong> ${book.rating || "N/A"} ⭐</p>
        <p><strong>Description:</strong><br>${book.description}</p>
      </div>
    `;
  } catch (err) {
    console.error("fail to read detail data", err);
  }
});
