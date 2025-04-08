// Function to check if the user is logged in
function isLoggedIn() {

    const authButtons = document.getElementById('auth-buttons');

    // Check if the element is visible (display block)
    const loggedIn = authButtons && authButtons.style.display === 'block';
//alert(loggedIn);
    return loggedIn ? 'no' : 'yes';
}

// Function to load the cart from localStorage
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log('Loaded Cart:', cart);
    return cart;
}

// Function to save the cart to localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to update the cart UI (header and checkout page)
function updateCartUI() {
    const cart = loadCart();
    const cartCounter = document.getElementById('cart-counter');
    //const cartItemsList = document.getElementById('cart-items-list');
    const cartItemsList = document.querySelector('.cart-items-list'); 
    //alert(cart.length);
    // Update the cart counter if the element exists
    if (cartCounter) {
        cartCounter.textContent = cart.length;
    }
//alert(cartCounter);
    // Update the cart items list in the header dropdown if the element exists
    if (cartItemsList) {
        cartItemsList.innerHTML = ''; // Clear the previous list
        cart.forEach(item => {
            const cartItemElement = document.createElement('li');
            cartItemElement.classList.add('mb-2');
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
            `;
            cartItemsList.appendChild(cartItemElement);
        });

        cartItemsList.innerHTML += `
        <div class="row mt-3">
        <div class="col-md-6">
            <a class="btn btn-primary btn-sm w-100" id="checkout">Checkout</a>
            </div>
            <div class="col-md-6">
            <button class="btn btn-secondary btn-sm w-100" id="checkoutAsGuest">Checkout as Guest</button>
            </div>
        </div>
    `;

    }

    // Also update the checkout page if the element exists
    const checkoutItemsList = document.getElementById('checkout-items-list');
    if (checkoutItemsList) {
        checkoutItemsList.innerHTML = ''; // Clear the previous list
        cart.forEach(item => {
            const checkoutItemElement = document.createElement('li');
            checkoutItemElement.classList.add('mb-2');
            checkoutItemElement.innerHTML = `
                <div class="d-flex justify-content-between">
                    <span><strong>${item.title}</strong></span>
                    <span>$${item.price}</span>
                </div>
            `;
            checkoutItemsList.appendChild(checkoutItemElement);
        });
    }
}

// Function to handle adding a book to the cart
function handleAddToCart(button) {
    // Retrieve the data attributes from the clicked button
    const bookId = button.getAttribute('data-id');
    const bookTitle = button.getAttribute('data-title');
    const bookAuthor = button.getAttribute('data-author');
    const bookPrice = button.getAttribute('data-price');
    const bookImage = button.getAttribute('data-image');

    // Create a cart item object
    const cartItem = {
        id: bookId,
        title: bookTitle,
        author: bookAuthor,
        price: bookPrice,
        image: bookImage,
        quantity: 1 // Set initial quantity to 1
    };

    // Get the current cart from localStorage or initialize an empty array if not present
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the book is already in the cart
    const existingBookIndex = cart.findIndex(item => item.id === bookId);

    if (existingBookIndex >= 0) {
        // If the book already exists, increase the quantity
        cart[existingBookIndex].quantity += 1;
    } else {
        // Otherwise, add it to the cart
        cart.push(cartItem);
    }

    // Save the updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update the cart UI (both header and checkout page)
    updateCartUI();

    // Change the button text to "Added to cart"
    button.innerHTML = "<i class='bi bi-cart'></i> Added to cart";
    
    // Optionally, you can disable the button to prevent multiple adds
    button.disabled = true;
}

// Function to remove an item from the cart by ID
function removeFromCart(bookId) {
    let cart = loadCart();
    
    // Filter out the item to be removed
    cart = cart.filter(item => item.id !== bookId);

    // Save the updated cart back to localStorage
    saveCart(cart);

    // Update the cart UI
    updateCartUI();
}

// Function to clear all items in the cart
function clearCart() {
    saveCart([]); // Empty array to clear the cart
    updateCartUI(); // Update the UI after clearing the cart
}






// Initialize the cart UI on page load
document.addEventListener('DOMContentLoaded', function () {
    //updateCartUI();

    setTimeout(() => {
        const cartCounter = document.getElementById('cart-counter');
        //const cartItemsList = document.getElementById('cart-items-list');
        const cartItemsList = document.querySelector('.cart-items-list'); 
        
        if (cartCounter && cartItemsList) {
            // Continue with your cart update logic here
            updateCartUI();
        }

        

        const checkoutButton = document.getElementById('checkout');
        if (checkoutButton) {
            checkoutButton.addEventListener('click', function () {
                //console.log("isLoggedIn=" + isLoggedIn());
                if (isLoggedIn()==='yes') {
                    window.location.href = 'place-order.html';
                } else {
                    alert('You must be logged in to proceed with the checkout.');
                    //window.location.href = 'login.html';
                    document.getElementById('login').click()
                }
            });
        } else {
            console.error("Checkout button not found!");
        }

        
        const checkoutAsGuestButton = document.getElementById('checkoutAsGuest');
        if (checkoutAsGuestButton) {
            checkoutAsGuestButton.addEventListener('click', function () {
                //console.log("isLoggedIn=" + isLoggedIn());
                window.location.href = 'place-order.html';
            });
        } else {
            console.error("Checkout button not found!");
        }


        


    }, 100);





});
