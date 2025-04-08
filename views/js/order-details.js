window.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("id");


  try {
    const sessionRes = await fetch('/session-info');
    const sessionData = await sessionRes.json();
    const backBtn = document.getElementById("backButton");
    if (sessionData.user && backBtn) {
      const role = sessionData.user.role;
      backBtn.href = role === 'admin' ? 'orders.html' : 'dashboard.html';
    }
  } catch (e) {
    console.error("Failed to set back button path:", e);
  }

  if (!orderId) {
    alert("Order ID is missing.");
    return;
  }

  try {
    const res = await fetch(`/orders/${orderId}`);
    const data = await res.json();

    if (data.status !== 200) {
      alert("Order not found.");
      return;
    }

    const order = data.order;
    const container = document.getElementById("orderDetailsTableBody");
    if (!container) {
      console.error("Container not found");
      return;
    }

    order.cart.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.title}</td>
        <td>${item.author}</td>
        <td>${item.price}</td>
        <td>${item.quantity}</td>
      `;
      container.appendChild(row);
    });

    document.getElementById("orderName").textContent = order.name;
    document.getElementById("orderDate").textContent = new Date(order.since).toLocaleDateString();
    document.getElementById("orderTotal").textContent = `$${order.total}`;
  } catch (err) {
    console.error("Error loading order:", err);
    alert("Error loading order details.");
  }
});
