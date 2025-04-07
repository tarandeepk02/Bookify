let cart = JSON.parse(localStorage.getItem('cart')) || [];

export function addToCart(book) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];  // Retrieve cart from localStorage, or initialize an empty array

    // Check if the book already exists in the cart
    const existingBookIndex = cart.findIndex(item => item.id === book.id);
    if (existingBookIndex >= 0) {
        // If the book already exists, just increase the quantity
        cart[existingBookIndex].quantity += 1;
    } else {
        // If the book doesn't exist, add it to the cart with quantity = 1
        book.quantity = 1;
        cart.push(book);
    }

    // Save the updated cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Show an alert with the book title
    alert(`${book.title} has been added to your cart.`);
    

    
}



