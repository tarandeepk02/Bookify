(() => {


    async function postData(url = "", data = {}) {
        const response = await fetch(url, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(data),
        })

        const reply = await response.json()
        return reply
    }


    const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1)
    document.getElementById("contact-form").addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent the default button behavior

        let name = document.querySelector("#name").value
        let email = document.querySelector("#email").value
        let phone = document.querySelector("#phone").value
        let yourMessage = document.querySelector("#yourMessage").value




        // Send form data to server using fetch
        const response = await postData('/addQuery', {
            name,
            email,
            phone,
            yourMessage,
        });

        if (response.status === 200) {
            // Success handling
            Swal.fire("Success", response.msg, "success").then(() => {
                window.location.href = '/contact-us.html';  // Redirect after success
            });
        } else {
            // Validation or other errors from the server

            for (const [field, errorMessage] of Object.entries(response.errors)) {
                const errorElement = document.getElementById('error' + capitalizeFirstLetter(field));
                if (errorElement) {
                    errorElement.innerText = errorMessage.msg;  // Show error message
                }
            }
            Swal.fire("Validation Error", "Please correct the form errors.", "error");
        }






        try {

        } catch (err) {
            console.error('Error during form submission:', err);
            Swal.fire("Error", "Something went wrong while sending your message. Please try again later.", "error");
        }
    })
})()