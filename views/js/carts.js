(() => {
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
    window.handleAddToCart = (button) => {
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
    window.removeFromCart = (bookId) => {
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
    window.clearCart = () => {
        saveCart([])
        updateCartUI()
    }
    //CART PAGE ENDS HERE
    const updateCartUIHandler = async () => {
        const cartCounter = document.getElementById('cart-counter')
        const cartItemsList = document.querySelector('.cart-items-list')

        if (cartCounter && cartItemsList) {
            updateCartUI()
        }

        const checkoutButton = document.getElementById('checkout')
        if (checkoutButton) {
            checkoutButton.addEventListener('click', () => {
                if (isLoggedIn() === 'yes') {
                    window.location.href = 'place-order.html'
                } else {
                    alert('You must be logged in to proceed with the checkout.')
                    document.getElementById('login').click()
                }
            })
        } else {
            console.error("Checkout button not found!")
        }

        const checkoutAsGuestButton = document.getElementById('checkoutAsGuest')
        if (checkoutAsGuestButton) {
            checkoutAsGuestButton.addEventListener('click', () => {
                window.location.href = 'place-order.html'
            })
        } else {
            console.error("Checkout button not found!")
        }
    }

    updateCartUIHandler()



})()