// cart details 
document.addEventListener("DOMContentLoaded", () => {
    renderCartItems(); // Render the cart when the page loads
});

function renderCartItems() {
    const cartItemsString = localStorage.getItem('cart');
    const cartItems = cartItemsString ? JSON.parse(cartItemsString) : [];
    const cartItemsContainer = document.getElementById('cartItemsContainer');

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
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col" class="h5">Shopping Bag</th>
                                        <th scope="col">Format</th>
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

                        <div class="card shadow-2-strong mb-5 mb-lg-0" style="border-radius: 16px;">
                            <div class="card-body p-4">
                                <div class="row">
                                    <div class="col-lg-4 col-xl-3 ms-auto">
                                        <div class="d-flex justify-content-between" style="font-weight: 500;">
                                            <p class="mb-2">Subtotal</p>
                                            <p class="mb-2">$${totalPrice.toFixed(2)}</p>
                                        </div>

                                        <div class="d-flex justify-content-between" style="font-weight: 500;">
                                            <p class="mb-0">Shipping</p>
                                            <p class="mb-0">$${shipping.toFixed(2)}</p>
                                        </div>

                                        <hr class="my-4">

                                        <div class="d-flex justify-content-between mb-4" style="font-weight: 500;">
                                            <p class="mb-2">Total (tax included)</p>
                                            <p class="mb-2">$${finalTotal.toFixed(2)}</p>
                                        </div>

                                        <a href ="/place-order.html" type="button" data-mdb-button-init data-mdb-ripple-init class="btn btn-primary btn-block btn-lg">
                                            <div class="d-flex justify-content-between">
                                                <span>Place Order</span>
                                                <span>$${finalTotal.toFixed(2)}</span>
                                            </div>
                                        </a>
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
}

function generateBookRow(item) {
    return `
        <tr>
            <th scope="row">
                <div class="d-flex align-items-center">
                    <img src="${item.image}" class="img-fluid rounded-3" style="width: 120px;" alt="${item.title}">
                    <div class="flex-column ms-4">
                        <p class="mb-2">${item.title}</p>
                        <p class="mb-0">${item.author}</p>
                    </div>
                </div>
            </th>
            <td class="align-middle">
                <p class="mb-0" style="font-weight: 500;">Digital</p>
            </td>
            <td class="align-middle">
                <div class="d-flex flex-row">
                    <button data-mdb-button-init data-mdb-ripple-init class="btn btn-link px-2"
                        onclick="decrementQuantity(this, '${item.id}')">
                        <i class="fas fa-minus"></i>
                    </button>

                    <input id="quantity-${item.id}" min="1" name="quantity" value="1" type="number"
                        class="form-control form-control-sm" style="width: 50px;" />

                    <button data-mdb-button-init data-mdb-ripple-init class="btn btn-link px-2"
                        onclick="incrementQuantity(this, '${item.id}')">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </td>
            <td class="align-middle">
                <p class="mb-0" style="font-weight: 500;">$${item.price}</p>
            </td>
        </tr>
    `;
}

function calculateTotals(items) {
    let totalPrice = 0;
    items.forEach(item => {
        totalPrice += parseFloat(item.price);
    });
    const shipping = 2.99;
    const finalTotal = totalPrice + shipping;
    return { totalPrice, shipping, finalTotal };
}

function incrementQuantity(button, itemId) {
    const input = button.parentNode.querySelector(`input[id="quantity-${itemId}"]`);
    input.stepUp();

}

function decrementQuantity(button, itemId) {
    const input = button.parentNode.querySelector(`input[id="quantity-${itemId}"]`);
    input.stepDown();
}