const loadBooks = async (book, container) => {
  const card = document.createElement("div");
  card.className = "col-sm-6 col-lg-3 mb-4";
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
};

const loadGoogleBooksCarousel = async () => {
  try {
    // random keyword 
    const queries = ["fiction", "science", "travel", "romance", "history", "fantasy", "javascript", "ai", "art"];
    const query = queries[Math.floor(Math.random() * queries.length)];

    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=9`);
    const data = await res.json();
    const books = data.items;
    //console.log("Google Books:", books);

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
};

//CART PAGE
// Function to check if the user is logged in
const isLoggedIn = () => {
  const authButtons = document.getElementById('auth-buttons')
  const loggedIn = authButtons && authButtons.style.display === 'block'
  return loggedIn ? 'no' : 'yes'
}

// Function to load the cart from localStorage
const loadCart = () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || []
  //console.log('Loaded Cart:', cart)
  return cart
}

// Function to save the cart to localStorage
const saveCart = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart))
}

// Function to update the cart UI (header and checkout page)
const updateCartUI = () => {
  const cart = loadCart()
  const cartCounter = document.getElementById('cart-counter')
  const cartItemsList = document.querySelector('.cart-items-list')

  if (cartCounter) {
    cartCounter.textContent = cart.length
  }

  if (cartItemsList) {
    cartItemsList.innerHTML = ''
    if (cart.length === 0) {

      const noItemsMessage = document.createElement('li')
      noItemsMessage.classList.add('mb-2')
      noItemsMessage.classList.add('text-center')
      noItemsMessage.innerHTML = "<strong>No items in the cart!</strong>"
      cartItemsList.appendChild(noItemsMessage)
    } else {
      cart.forEach(item => {
        const cartItemElement = document.createElement('li')
        cartItemElement.classList.add('mb-2')
        cartItemElement.innerHTML = `
              <div class="row">
                  <div class="col-md-10">
                      <strong>${item.title}</strong> <br>
                      <span class="text-success">Price: $${item.price}</span>
                  </div>
                  <div class="col-md-2">
                      <button class="btn btn-danger btn-sm" onclick="removeFromCart('${item.id}')">
                          <i class="bi bi-trash"></i>
                      </button>
                  </div>
              </div>
              <hr>
          `
        cartItemsList.appendChild(cartItemElement)
      })

      cartItemsList.innerHTML += `
          <div class="row mt-3">
              <div class="col-md-6">
                  <a class="btn btn-primary btn-sm w-100" id="checkout">Checkout</a>
              </div>
              <div class="col-md-6">
                  <button class="btn btn-secondary btn-sm w-100" id="checkoutAsGuest">Checkout as Guest</button>
              </div>
          </div>
      `
    }
  }

  const checkoutItemsList = document.getElementById('checkout-items-list')
  if (checkoutItemsList) {
    checkoutItemsList.innerHTML = ''
    cart.forEach(item => {
      const checkoutItemElement = document.createElement('li')
      checkoutItemElement.classList.add('mb-2')
      checkoutItemElement.innerHTML = `
              <div class="d-flex justify-content-between">
                  <span><strong>${item.title}</strong></span>
                  <span>$${item.price}</span>
              </div>
          `
      checkoutItemsList.appendChild(checkoutItemElement)
    })
  }
}

// Function to handle adding a book to the cart
const handleAddToCart = (button) => {
  const bookId = button.getAttribute('data-id')
  const bookTitle = button.getAttribute('data-title')
  const bookAuthor = button.getAttribute('data-author')
  const bookPrice = button.getAttribute('data-price')
  const bookImage = button.getAttribute('data-image')

  const cartItem = {
    id: bookId,
    title: bookTitle,
    author: bookAuthor,
    price: bookPrice,
    image: bookImage,
    quantity: 1
  }

  let cart = JSON.parse(localStorage.getItem('cart')) || []

  const existingBookIndex = cart.findIndex(item => item.id === bookId)

  if (existingBookIndex >= 0) {
    cart[existingBookIndex].quantity += 1
  } else {
    cart.push(cartItem)
  }

  localStorage.setItem('cart', JSON.stringify(cart))

  updateCartUI()

  button.innerHTML = "<i class='bi bi-cart'></i> Added to cart"
  button.disabled = true
}

// Function to remove an item from the cart by ID
const removeFromCart = (bookId) => {
  let cart = loadCart()
  cart = cart.filter(item => item.id !== bookId)
  saveCart(cart)
  updateCartUI()

  const button = document.querySelector(`[data-id="${bookId}"]`)
  if (button) {
    button.innerHTML = "<i class='bi bi-cart'></i> Add to cart"
    button.disabled = false
  }
}

// Function to clear all items in the cart
const clearCart = () => {
  saveCart([])
  updateCartUI()
}

//CART PAGE ENDS HERE

const loadBooksData = async () => {
  try {
    // 1. loading from MongoDB
    const res = await fetch("/books");
    const books = await res.json();
    const limitedBooks = books.slice(0, 8);
    const container = document.getElementById("bookCards");

    limitedBooks.forEach(book => loadBooks(book, container));

    const allBooks = books;
    const container1 = document.getElementById("bookCardsAll");

    allBooks.forEach(book => loadBooks(book, container1));

    // 2. Google Books Carousel
    await loadGoogleBooksCarousel();

  } catch (error) {
    console.error("fail to read book data.", error);
  }
}


const updateCartUIHandler = async () => {
  const cartCounter = document.getElementById('cart-counter')
  const cartItemsList = document.querySelector('.cart-items-list')

  if (cartCounter && cartItemsList) {
    updateCartUI()
  }


}


document.addEventListener("DOMContentLoaded", async () => {
  await loadBooksData();
  updateCartUIHandler();

  document.body.addEventListener('click', (event) => {
    if (event.target && event.target.id === 'checkout') {
      if (isLoggedIn() === 'yes') {
        window.location.href = 'place-order.html';
      } else {
        Swal.fire("Oops", "You must be logged in to proceed with the checkout.", "warning").then(() => {
          document.getElementById('login').click();
        });
      }
    }

    if (event.target && event.target.id === 'checkoutAsGuest') {
      window.location.href = 'place-order.html';
    }
  });
});
