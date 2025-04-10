window.addEventListener("DOMContentLoaded", async () => {
  // Wait a bit to make sure sidebar and session are fully loaded
  await new Promise((resolve) => setTimeout(resolve, 500)); // Adjust delay as needed

  try {
    // 1. Fetch user role
    const sessionRes = await fetch("/session-info");
    const sessionData = await sessionRes.json();

    if (!sessionData.user) {
      alert("You must be logged in to view orders.");
      return;
    }

    const userRole = sessionData.user.role;
    const fetchUrl = userRole === "admin" ? "/orders/all" : "/orders";

    // 2. Fetch orders
    const res = await fetch(fetchUrl);
    const data = await res.json();


    //console.log("data="+JSON.stringify(data));

    if (data.status === 200) {
      const orders = data.orders;
      const table = document.getElementById("ordersTableBody");

      // Dynamically set the table headers
      const headerRow = document.getElementById("orderTableHeader");
      if (headerRow) {
        headerRow.innerHTML = `
    ${userRole === "admin" ? "<th>Name</th><th>Email</th><th>Role</th>" : ""}
    <th>Order Date</th>
    <th>Shipping Address</th>
    <th>Total</th>
    <th>Books</th>
    <th>Actions</th>
  `;
      }
      if (!orders.length) {
        table.innerHTML = `<tr><td colspan="7" class="text-center">No orders found</td></tr>`;
        return;
      }

      orders.forEach((order) => {
        const row = document.createElement("tr");
        row.innerHTML = `
    ${userRole === "admin"
            ? `
      <td>${order.checkoutName || "-"}</td>
      <td>${order.checkoutEmail || "-"}</td>
      <td>
        ${order.userRole === "member"
              ? '<span class="badge bg-success">Member</span>'
              : '<span class="badge bg-warning">Guest</span>'}
      </td>
    `
            : ""
          }
    <td>${order.since ? new Date(order.since).toLocaleDateString() : "-"}</td>
    <td>${order.shippingAddress || "-"}</td>
    <td>$${order.total !== undefined ? order.total : "-"}</td>
    <td>
      <ul>
        ${order.cart && Array.isArray(order.cart)
            ? order.cart
              .map((item) => `<li>${item.title} x ${item.quantity}</li>`)
              .join("")
            : ""
          }
      </ul>
    </td>
    <td>
      <a href="order-details.html?id=${order._id
          }" class="btn btn-outline-success btn-sm"><i class="bi bi-eye"></i></a>
    </td>
  `;
        table.appendChild(row);
      });
    } else {
      alert("Failed to fetch orders.");
    }
  } catch (error) {
    console.error("Failed to load orders:", error);
    alert("Error loading orders.");
  }
});
