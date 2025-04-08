// using IIFE
(() => {

    /**----------------------------------------------------
    Utility functions
    -----------------------------------------------------*/
    const getBlobData = async (url) => {
        const response = await fetch(url)
        const imageBlob = await response.blob()
        return imageBlob
    }
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

    /**----------------------------------------------------
    Utility functions
    -----------------------------------------------------*/
    const getBooks = () => {
        //console.info("Getting books")
        fetch('/books')
            .then(response => response.json())
            .then(books => displayBooks(books))
            .catch(err => console.error(err))
    }
    const displayBooks = async (books) => {
        let tbody = document.querySelector("#booksData tbody")
        tbody.innerHTML = ""
        if (books.length > 0) {
            //console.info("Books:", books)        
            books.forEach((book, index) => {
                let tr = document.createElement("tr")

                // Add Sr. No.
                let tdSrNo = document.createElement("td")
                tdSrNo.innerHTML = `<kbd>${index + 1}</kbd>`
                tr.appendChild(tdSrNo)

                // Add Name
                let tdTitle = document.createElement("td")
                tdTitle.textContent = book.title
                tr.appendChild(tdTitle)

                // Add Email ID
                let tdAuthors = document.createElement("td")
                tdAuthors.textContent = book.authors
                tr.appendChild(tdAuthors)

                let tdPublisher = document.createElement("td")
                tdPublisher.textContent = book.publisher
                tr.appendChild(tdPublisher)

                // let tdAt = document.createElement("td")
                // tdAt.textContent = book.since
                // tr.appendChild(tdAt)

                // Add Action Button
                let tdAction = document.createElement("td")

                // Create Edit Button
                let editBtn = document.createElement("button")
                editBtn.classList.add("btn", "btn-outline-info", "btn-sm", "me-2")
                editBtn.innerHTML = '<i class="bi bi-pencil"></i>'
                editBtn.onclick = () => editBook(book._id)
                tdAction.appendChild(editBtn)

                // Create View Details Button
                let viewBtn = document.createElement("button")
                viewBtn.classList.add("btn", "btn-outline-success", "btn-sm", "me-2")
                viewBtn.innerHTML = '<i class="bi bi-eye"></i>'
                viewBtn.onclick = () => displayBookDetails(book._id)
                tdAction.appendChild(viewBtn)

                // Create Delete Button
                let deleteBtn = document.createElement("button")
                deleteBtn.classList.add("btn", "btn-outline-danger", "btn-sm")
                deleteBtn.innerHTML = '<i class="bi bi-trash"></i>'
                deleteBtn.onclick = () => deleteBook(book._id)
                tdAction.appendChild(deleteBtn)
                tr.appendChild(tdAction)
                // Append row to the table body
                tbody.appendChild(tr)
            })
        } else {
            //console.info("No books data available")
            let tr = document.createElement("tr")
            let td = document.createElement("td")
            td.colSpan = 5
            td.style.textAlign = "center"
            td.innerHTML = "No books data available"
            tr.appendChild(td)
            tbody.appendChild(tr)
        }
    }
    const displayDetails = () => {
        document.querySelector('#post').style.display = 'block'
        document.querySelector('#posts').style.display = 'none'
    }
    const displayBookDetails = async (id) => {
        const book = await getJsonData(`/book/${id}`)
        console.info("book details:", book)
        let cardContent = ''
        const bookDetails = book.book
        Object.keys(bookDetails).forEach((key) => {

            let value = bookDetails[key]

            if (key != '_id') {
                if (key == 'coverImage') {
                    value = '<img src="' + value + '" width="200">'
                }
                cardContent += `
                <p class="card-text">
                    <strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> <span id="user${key}">${value}</span>
                </p>
            `
            }

        })
        document.querySelector("#book .card-body").innerHTML = cardContent
        document.querySelector("#book").style.display = "block"
        document.querySelector("#books").style.display = "none"
    }

    const deleteBook = async (bookId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Send DELETE request to the server
                    const response = await fetch(`/book/${bookId}`, {
                        method: "DELETE",
                    })

                    if (response.ok) {
                        Swal.fire("Deleted!", "Book has been deleted.", "success");
                        getBooks()
                    } else {
                        Swal.fire("Error", "Failed to delete book.", "error");
                    }
                } catch (err) {
                    //console.error("Error while deleting book:", err)
                    Swal.fire("Error", "Failed to delete book.", "error");
                }
            }
        })
    }

    const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1)

    const clearErrors = () => {
        const errorElements = document.querySelectorAll('.error')
        errorElements.forEach(error => error.innerText = '')
    }

    const bookAdd = async (event) => {
        event.preventDefault()

        document.getElementById("since").value = new Date().toISOString();

        const formData = new FormData(event.target)
        // for (let [key, value] of formData.entries()) {
        //     console.log(`${key}: ${value}`)
        // }
        try {
            const response = await fetch('/addBook', {
                method: 'POST',
                body: formData
            })

            //console.log("response=" + JSON.stringify(response))

            if (response.status == 200) {
                Swal.fire("Success", "Book added successfully", "success").then(() => {
                    window.location.href = '/books.html';
                });
            } else {
                const errorData = await response.json()
                for (const [field, errorMessage] of Object.entries(errorData.errors)) {
                    const errorElement = document.getElementById('error' + capitalizeFirstLetter(field))
                    if (errorElement) {
                        errorElement.innerText = errorMessage.msg
                    }
                }
                Swal.fire("Validation Error", "Please correct the form errors.", "error")
            }
        } catch (err) {
            //console.error('Error during form submission:', err)
            Swal.fire("Error", "Something went wrong while adding book.", "error");
        }
    }

    const bookEdit = async (event) => {
        event.preventDefault()

        try {
            // Get form data
            const formData = new FormData(event.target)
            // Log the data being sent to the backend for debugging
            // for (let [key, value] of formData.entries()) {
            //     console.log(`${key}: ${value}`)
            // }
            const response = await fetch('/editBookk', {
                method: 'POST',
                body: formData
            })

            console.log("response=" + JSON.stringify(response))

            if (response.status == 200) {
                Swal.fire("Success", "Book updated successfully", "success").then(() => {
                    window.location.href = '/books.html';
                });
            }
            else {
                const errorData = await response.json()
                console.log("errorData=" + JSON.stringify(errorData))
                for (const [field, errorMessage] of Object.entries(errorData.errors)) {
                    const errorElement = document.getElementById('error' + capitalizeFirstLetter(field))
                    if (errorElement) {
                        errorElement.innerText = errorMessage.msg
                    }
                }
                Swal.fire("Validation Error", "Please correct the form errors.", "error");
            }

        } catch (err) {
            //console.error('Error during form submission:', err)
            Swal.fire("Error", "Something went wrong while updating book.", "error");
        }
    }

    const viewBooks = async (users) => {
        document.querySelector("#book").style.display = "none"
        document.querySelector("#books").style.display = "block"
    }

    const editBook = async (bookId) => {
        const book = await getJsonData(`/book/${bookId}`)
        const bookDetails = book.book

        Object.keys(bookDetails).forEach((key) => {
            if (key !== '_idd') {
                const inputField = document.querySelector(`#${key}`)
                if (inputField) {
                    if (key === 'coverImage') {
                        document.querySelector("#currentCoverImage").value = `${bookDetails[key]}`
                        document.querySelector("#bookImage").src = `${bookDetails[key]}`

                    } else {
                        inputField.value = bookDetails[key]
                    }
                }
            }
        })

        document.querySelector("#editBookFormDiv").style.display = "block"
        document.querySelector("#books").style.display = "none"
    }

    window.onload = () => {
        viewBooks()
        getBooks()

        document.querySelector("#viewBooks")?.addEventListener("click", viewBooks)
        document.querySelector("#addBookForm")?.addEventListener("submit", bookAdd)
        document.querySelector("#editBookForm")?.addEventListener("submit", bookEdit)

    }
})()
