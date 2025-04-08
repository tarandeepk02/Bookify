(() => {
    const renderOrderItems = () => {
        const cartItemsString = localStorage.getItem('cart');
        const cartItems = cartItemsString ? JSON.parse(cartItemsString) : [];
        const cartItemsContainer = document.getElementById('place-order');

        if (!cartItems || cartItems.length === 0) {
            cartItemsContainer.innerHTML = `
                <section class="h-100 h-custom">
                    <div class="container h-100 py-5">
                        <div class="row d-flex justify-content-center align-items-center h-100">
                            <div class="col">
                                <p>Your shopping bag is empty.</p>
                            </div>
                        </div>
                    </div>
                </section>
            `;
            return;
        }

        let cartHtml = `
            <section class="h-100 h-custom">
                <div class="container h-100 py-5">
                    <div class="row d-flex justify-content-center align-items-center h-100">
                        <div class="col">
                            <div class="table-responsive">
                                <table class="table table-bordered table-stripped">
                                    <thead>
                                        <tr>
                                            <th scope="col" class="h5">Your Bag</th>
                                            <th scope="col">Quantity</th>
                                            <th scope="col">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
        `;

        // Generate book rows using a separate function
        cartItems.forEach(item => {
            cartHtml += generateBookRow(item);
        });

        // Calculate total price and add footer
        const { totalPrice, shipping, finalTotal } = calculateTotals(cartItems);

        cartHtml += `
                                    </tbody>
                                </table>
                            </div>

                            <div class="card shadow-2-strong mb-5 mb-lg-0">
                                <div class="card-body p-4">
                                    <div class="row">
                                        <div class="col-lg-4 col-xl-6 ms-auto">
                                            <div class="d-flex justify-content-between" style="font-weight: 500">
                                                <p class="mb-2">Subtotal</p>
                                                <p class="mb-2" id="subtotal">$${totalPrice.toFixed(2)}</p>
                                            </div>

                                            <div class="d-flex justify-content-between" style="font-weight: 500">
                                                <p class="mb-0">Shipping</p>
                                                <p class="mb-0" id="shipping">$${shipping.toFixed(2)}</p>
                                            </div>

                                            <hr class="my-4">

                                            <div class="d-flex justify-content-between mb-4" style="font-weight: 500">
                                                <p class="mb-2">Total (tax included)</p>
                                                <p class="mb-2" id="total">$${finalTotal.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;

        cartItemsContainer.innerHTML = cartHtml;
    };

    const generateBookRow = (item) => {
        return `
            <tr>
                <th scope="row">
                    <div class="d-flex align-items-center">
                        <img src="${item.image}" class="img-fluid rounded-3" style="width: 120px" alt="${item.title}">
                        <div class="flex-column ms-4">
                            <p class="mb-2">${item.title}</p>
                            <p class="mb-0">${item.author}</p>
                        </div>
                    </div>
                </th>
                <td class="align-middle">
                    <div class="d-flex flex-row">
                        <button data-mdb-button-init data-mdb-ripple-init class="btn btn-link px-2"
                            onclick="decrementQuantity(this, '${item.id}')">
                            <i class="fas fa-minus"></i>
                        </button>

                        <input id="quantity-${item.id}" min="1" name="quantity" value="${item.quantity}" type="number"
                            class="form-control form-control-sm" style="width: 50px" onchange="updatePrice(this, '${item.id}')"/>

                        <button data-mdb-button-init data-mdb-ripple-init class="btn btn-link px-2"
                            onclick="incrementQuantity(this, '${item.id}')">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </td>
                <td class="align-middle">
                    <p class="mb-0" style="font-weight: 500" id="price-${item.id}">$${(item.price * item.quantity).toFixed(2)}</p>
                </td>
            </tr>
        `;
    };

    const calculateTotals = (items) => {
        let totalPrice = 0;
        items.forEach(item => {
            totalPrice += item.price * item.quantity;
        });
        const shipping = 100;
        const finalTotal = totalPrice + shipping;
        return { totalPrice, shipping, finalTotal };
    };

    const incrementQuantity = (button, itemId) => {
        const input = button.parentNode.querySelector(`input[id="quantity-${itemId}"]`);
        input.stepUp(); // Increment the quantity
        updatePrice(input, itemId); // Update price with the new quantity
    };

    const decrementQuantity = (button, itemId) => {
        const input = button.parentNode.querySelector(`input[id="quantity-${itemId}"]`);
        input.stepDown(); // Decrement the quantity
        updatePrice(input, itemId); // Update price with the new quantity
    };

    window.updatePrice = (input, itemId) => {
        const cartItemsString = localStorage.getItem('cart');
        const cartItems = cartItemsString ? JSON.parse(cartItemsString) : [];

        const item = cartItems.find(item => item.id === itemId);
        item.quantity = parseInt(input.value, 10); // Update the item's quantity in localStorage
        localStorage.setItem('cart', JSON.stringify(cartItems));

        const itemPrice = item.price * item.quantity; // Recalculate the price
        const priceElement = document.getElementById(`price-${itemId}`);
        priceElement.innerText = `$${itemPrice.toFixed(2)}`; // Update the price on the page

        const { totalPrice, shipping, finalTotal } = calculateTotals(cartItems); // Recalculate totals

        document.getElementById('subtotal').innerText = `$${totalPrice.toFixed(2)}`; // Update subtotal
        document.getElementById('shipping').innerText = `$${shipping.toFixed(2)}`; // Update shipping
        document.getElementById('total').innerText = `$${finalTotal.toFixed(2)}`; // Update final total
    };

    const checkout = async (event) => {
        event.preventDefault();

        let checkoutName = document.querySelector("#checkoutName").value;
        let checkoutEmail = document.querySelector("#checkoutEmail").value;
        let shippingAddress = document.querySelector("#shippingAddress").value;
        let subtotal = document.querySelector("#subtotal").textContent.replace('$', '');
        let shipping = document.querySelector("#shipping").textContent.replace('$', '');
        let total = document.querySelector("#total").textContent.replace('$', '');
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        let since = new Date().toISOString();

        try {
            const response = await fetch('/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    checkoutName,
                    checkoutEmail,
                    shippingAddress,
                    subtotal,
                    shipping,
                    total,
                    cart,
                    since
                })
            });

            if (response.status == 200) {
                localStorage.removeItem('cart');
                window.location.href = '/success.html';
            } else {
                const errorData = await response.json();
                for (const [field, errorMessage] of Object.entries(errorData.errors)) {
                    const errorElement = document.getElementById('error' + capitalizeFirstLetter(field));
                    if (errorElement) {
                        errorElement.innerText = errorMessage.msg;
                    }
                }
            }
        } catch (err) {
            console.error('Error during form submission:', err);
        }
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    window.addEventListener('load', () => {
        const checkoutBtn = document.querySelector("#checkoutBtnn");
        if (checkoutBtn) {
            checkoutBtn.addEventListener("click", checkout);
        } else {
            console.error('Checkout button not found!');
        }
        renderOrderItems();
    })
})()
