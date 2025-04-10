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
            })
            const result = await response.json()
            return result
        } catch (err) {
            console.error(err)
        }
    }

    /**----------------------------------------------------
    Utility functions
    -----------------------------------------------------*/

    /**----------------------------------------------------
    Display profile data in form
    -----------------------------------------------------*/
    const displayProfile = async () => {
        const data = await getJsonData('/profile')
        if (!data || !data.user) return

        const user = data.user

        Object.keys(user).forEach(key => {
            if (key === 'picture' && user[key] != "") {
                const imageElement = document.getElementById('profileImage')
                if (imageElement) {
                    if (user[key] != null && user[key] != '') {
                        imageElement.src = user[key]
                    }
                }
            } else {
                const input = document.querySelector(`#profileForm [name="${key}"]`)
                if (input) {
                    input.value = user[key]
                }
            }
        })
    }

    const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1)
    const clearErrors = () => {
        const errorElements = document.querySelectorAll('.error')
        errorElements.forEach(error => error.innerText = '')
    }

    const updateProfile = async (event) => {
        event.preventDefault()
        const formData = new FormData(event.target)
        // for (let [key, value] of formData.entries()) {
        //     console.log(`${key}: ${value}`)
        // }

        try {
            const response = await fetch('/profile', {
                method: 'POST',
                body: formData
            })

            if (response.status == 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Profile Updated!',
                    text: 'Your profile has been successfully updated.'
                }).then(() => {
                    window.location.href = '/profile.html';
                })
            } else {
                const errorData = await response.json()

                for (const [field, errorMessage] of Object.entries(errorData.errors)) {
                    const errorElement = document.getElementById('error' + capitalizeFirstLetter(field))
                    if (errorElement) {
                        errorElement.innerText = errorMessage.msg
                    }
                }
            }

        } catch (err) {
            //console.error('Error during form submission:', err)
            // Swal.fire({
            //     icon: 'error',
            //     title: 'Error',
            //     text: 'An unexpected error occurred. Please try again.'
            // })
        }
    }

    const updatePassword = async (event) => {
        event.preventDefault()

        let oldPassword = document.querySelector("#oldPassword").value
        let newPassword = document.querySelector("#newPassword").value
        let confirmPassword = document.querySelector("#confirmPassword").value


        try {
            let response = await postJsonData("/password", {
                oldPassword,
                newPassword,
                confirmPassword
            })
            //console.log("Data=" + JSON.stringify(response))

            if (response && response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Password Updated!',
                    text: 'Your password has been successfully updated.'
                }).then(() => {
                    window.location.href = "/password.html"
                })
            }
            else if (response && response.status === 400) {
                Swal.fire({
                    icon: 'error',
                    title: 'Password Update Failed',
                    text: 'There was an issue with updating your password. Please check the details and try again.'
                })
            }

            else {
                const errorData = response

                for (const [field, errorMessage] of Object.entries(errorData.errors)) {
                    const errorElement = document.getElementById('error' + capitalizeFirstLetter(field))
                    if (errorElement) {
                        errorElement.innerText = errorMessage.msg
                    }
                }
            }

        } catch (err) {
            console.error('Error during form submission:', err)
            // Swal.fire({
            //     icon: 'error',
            //     title: 'Error',
            //     text: 'An unexpected error occurred during password update.'
            // })
        }

    }

    window.onload = () => {
        displayProfile()
        document.querySelector("#passwordForm")?.addEventListener("submit", updatePassword)
        document.querySelector("#profileForm")?.addEventListener("submit", updateProfile)
    }
})()
