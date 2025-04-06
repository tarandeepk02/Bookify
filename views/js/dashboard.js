// using IIFE
(() => {


    /**----------------------------------------------------
    Utility functions
    -----------------------------------------------------*/
    const getJsonData = async (url) => {
        try {
            console.info('getJsonData', url)
            const response = await fetch(url)
            console.info(response)
            const data = await response.json()
            return data
        } catch (err) {
            console.error(err)
        }
    }


    const postJsonData = async (url, data) => {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            return result;
        } catch (err) {
            console.error(err);
        }
    }

    /**----------------------------------------------------
    Utility functions
    -----------------------------------------------------*/

    /**----------------------------------------------------
    Display profile data in form
    -----------------------------------------------------*/
    const displayProfile = async () => {
        const data = await getJsonData('/profile');
        if (!data || !data.user) return;

        const user = data.user;

        // Fill input fields in the profileForm
        Object.keys(user).forEach(key => {

            if (key === 'picture' && user[key] != "") {

                const imageElement = document.getElementById('profileImage');
                if (imageElement) {
                    //console.log("Picture"+user[key]);
                    imageElement.src = user[key]; // Assuming it's a URL or base64
                }
            } else {
                const input = document.querySelector(`#profileForm [name="${key}"]`);
                if (input) {
                    input.value = user[key];
                }
            }
        });
    }
    // Function to capitalize the first letter of the field name
    const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);


    const clearErrors = () => {
        const errorElements = document.querySelectorAll('.error');
        errorElements.forEach(error => error.innerText = '');
    };
    const updateProfile = async (event) => {
        event.preventDefault();
        // Get form data
        const formData = new FormData(event.target);
        // Log the data being sent to the backend for debugging
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }


        try {

            const response = await fetch('/profile', {
                method: 'POST',
                body: formData
            });

            console.log("response=" + JSON.stringify(response));

            if (response.status == 200) {
                // If the response is successful, redirect the user
                window.location.href = '/profile.html';  // Example redirect on success
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


    const updatePassword = async (event) => {
        event.preventDefault();

        let oldPassword = document.querySelector("#oldPassword").value;
        let newPassword = document.querySelector("#newPassword").value;
        let confirmPassword = document.querySelector("#confirmPassword").value;

        let response = await postJsonData("/password", {
            oldPassword,
            newPassword,
            confirmPassword
        });

        console.log("Data=" + JSON.stringify(response));

        if (response && response.status === 200) {
            window.location.href = "/password.html";
        } 
        else if (response && response.status === 400) {
            document.querySelector(
                          "#form-error"
                        ).innerHTML = `<div class="alert alert-dismissible alert-danger">${
                            response.msg || "An error occurred. Please try again."
                        }</div>`;
         }
        
        else {
            // If response is not OK, handle validation errors
            const errorData = response; // Parse the response JSON

            // Loop through errors and display them
            for (const [field, errorMessage] of Object.entries(errorData.errors)) {
                const errorElement = document.getElementById('error' + capitalizeFirstLetter(field));
                if (errorElement) {
                    errorElement.innerText = errorMessage.msg;  // Display error message
                }
            }
        }
        try {
        } catch (err) {
            console.error('Error during form submission:', err);
            // Handle any errors that occur during the fetch process
        }

    }


    window.onload = () => {
        displayProfile()
        document.querySelector("#profileForm")?.addEventListener("submit", updateProfile);
        document.querySelector("#passwordForm")?.addEventListener("submit", updatePassword);

    }
})()
