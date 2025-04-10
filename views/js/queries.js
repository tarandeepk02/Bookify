window.addEventListener("DOMContentLoaded", async () => {
    // Wait a bit to make sure sidebar and session are fully loaded
    await new Promise((resolve) => setTimeout(resolve, 500)); // Adjust delay as needed

    try {
        // 1. Fetch user role
        const sessionRes = await fetch("/session-info");
        const sessionData = await sessionRes.json();

        if (!sessionData.user) {
            alert("You must be logged in to view queries.");
            return;
        }

        const userRole = sessionData.user.role;
        const fetchUrl = userRole === "admin" ? "/queries" : "/forbidden";

        // 2. Fetch orders
        const res = await fetch(fetchUrl);
        const data = await res.json();


        //console.log("data="+JSON.stringify(data));

        if (data.status === 200) {
            const queries = data.queries;
            const table = document.getElementById("queryTableBody");

            // Dynamically set the table headers
            const headerRow = document.getElementById("queryTableHeader");
            if (headerRow) {
                headerRow.innerHTML = `
      
      <th>Query Date</th>
      <th>Name</th>
      <th>Email</th>
       <th>Message</th>
      <th>Phone Number</th>
    `;
            }
            if (!queries.length) {
                table.innerHTML = `<tr><td colspan="4" class="text-center">No queries found</td></tr>`;
                return;
            }

            queries.forEach((query) => {
                const row = document.createElement("tr");


                if (userRole === "admin") {
                    row.innerHTML = `
                        <td>${query.created_on ? new Date(query.created_on).toLocaleDateString() : "-"}</td>
                        <td>${query.name || "-"}</td>
                        <td>${query.email || "-"}</td>
                        <td>${query.message || "-"}</td>
                        <td>${query.phone || "-"}</td>
                       
                    `;
                }

                // Append the newly created row to the table
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
