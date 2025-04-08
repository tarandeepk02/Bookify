

const renderOrderItems = () => {
    const cartItemsString = localStorage.getItem('cart');
    //console.log(cartItemsString);
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
    const { totalPrice, shipping, finalTotal } = calculateTotals(cartItems)

    cartHtml += `
                                </tbody>
                            </table>
                        </div>

                        <div class="card shadow-2-strong mb-5 mb-lg-0">
                            <div class="card-body p-4">
                                <div class="row">
                                    <div class="col-lg-4 col-xl-6 ms-auto">
                                        <div class="d-flex justify-content-between" style="font-weight: 500;">
                                            <p class="mb-2">Subtotal</p>
                                            <p class="mb-2" id="subtotal">$${totalPrice.toFixed(2)}</p>
                                        </div>

                                        <div class="d-flex justify-content-between" style="font-weight: 500;">
                                            <p class="mb-0">Shipping</p>
                                            <p class="mb-0" id="shipping">$${shipping.toFixed(2)}</p>
                                        </div>

                                        <hr class="my-4">

                                        <div class="d-flex justify-content-between mb-4" style="font-weight: 500;">
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
    // document.getElementById('checkoutButton').addEventListener('click', () => {
    //     if (!cartItems || cartItems.length === 0) {
    //         alert("Your cart is empty.");
    //         return;
    //     }

    //     fetch('/api/place-order', { // Replace '/api/place-order' with your API endpoint
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(cartItems),
    //     })
    //     .then(response => {
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }
    //         return response.json();
    //     })
    //     .then(data => {
    //         console.log('Success:', data);
    //         alert('Order placed successfully!');
    //         // Clear cart after successful order.
    //         cartItems = []; // reset the cart
    //         // Optionally, redirect the user or update the UI.
    //         window.location.href = '/order-confirmation';// replace with your confirmation page.
    //     })
    //     .catch(error => {
    //         console.error('Error:', error);
    //         alert('Failed to place order. Please try again.');
    //     });
    // });
}

const generateBookRow = (item) => {
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

const calculateTotals = (items) => {
    let totalPrice = 0;
    items.forEach(item => {
        totalPrice += parseFloat(item.price);
    });
    const shipping = 100;
    const finalTotal = totalPrice + shipping;
    return { totalPrice, shipping, finalTotal };
}

const incrementQuantity = (button, itemId) => {
    const input = button.parentNode.querySelector(`input[id="quantity-${itemId}"]`);
    input.stepUp();
}

const decrementQuantity = (button, itemId) => {
    const input = button.parentNode.querySelector(`input[id="quantity-${itemId}"]`);
    input.stepDown();
}

const checkout = async (event) => {
    event.preventDefault(); 
    //alert("checkpt");
    
    let checkoutName = document.querySelector("#checkoutName").value;
    let checkoutEmail = document.querySelector("#checkoutEmail").value;
    let shippingAddress = document.querySelector("#shippingAddress").value;
    let subtotal = document.querySelector("#subtotal").value;
    let shipping = document.querySelector("#shipping").value;
    let total  = document.querySelector("#total").value;
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    try {
        const response = await fetch('/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  // Set content type to JSON
            },
            body: JSON.stringify({
                checkoutName,
                checkoutEmail,
                shippingAddress,
                subtotal,
                shipping,
                total,
                cart
            })
        });

        console.log("response="+JSON.stringify(response));

        if (response.status == 200) {
            localStorage.removeItem('cart');
            window.location.href = '/success.html';  
        } else {
            // If response is not OK, handle validation errors
            const errorData = await response.json(); // Parse the response JSON

            // Loop through errors and display them
            for (const [field, errorMessage] of Object.entries(errorData.errors)) {
                const errorElement = document.getElementById('error' + capitalizeFirstLetter(field));
                if (errorElement) {
                    errorElement.innerText = errorMessage.msg;  // Display error message
                }
            }
        }
    } catch (err) {
        console.error('Error during form submission:', err);
        // Handle any errors that occur during the fetch process
    }
}

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};


document.addEventListener("DOMContentLoaded", () => {
    
    
    const checkoutBtn = document.querySelector("#checkoutBtnn");
    //alert(checkoutBtn);
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", checkout);
    }else {
        console.error('Checkout button not found!');
    }
    renderOrderItems()
});