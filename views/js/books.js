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
        console.info("Getting posts")
        fetch('/books')
            .then(response => response.json())
            .then(books => displayBooks(books))
            .catch(err => console.error(err))
    }
    const displayBooks = async (books) => {
        let tbody = document.querySelector("#booksData tbody");
        tbody.innerHTML = "";
        if (books.length > 0) {
            console.info("Books:", books);
            
      
            // Clear existing rows in case of re-fetch
            
      
            books.forEach((book, index) => {
              let tr = document.createElement("tr");
      
              // Add Sr. No.
              let tdSrNo = document.createElement("td");
              tdSrNo.innerHTML = `<kbd>${index + 1}</kbd>`;
              tr.appendChild(tdSrNo);
      
              // Add Name
              let tdTitle = document.createElement("td");
              tdTitle.textContent = book.title;
              tr.appendChild(tdTitle);
      
              // Add Email ID
              let tdAuthors = document.createElement("td");
              tdAuthors.textContent = book.authors;
              tr.appendChild(tdAuthors);

              let tdPublisher = document.createElement("td");
              tdPublisher.textContent = book.publisher;
              tr.appendChild(tdPublisher);

              let tdAt = document.createElement("td");
              tdAt.textContent = book.since;
              tr.appendChild(tdAt);
              
      
              // Add Action Button
              let tdAction = document.createElement("td");
      
              
              // Create Edit Button
            let editBtn = document.createElement("button");
            editBtn.classList.add("btn", "btn-outline-info", "btn-sm", "me-2"); // "me-2" adds right margin
            editBtn.innerHTML = '<i class="bi bi-pencil"></i>'; // Bootstrap pencil icon
            editBtn.onclick = () => editBook(book._id); // Add your edit function here
            tdAction.appendChild(editBtn);
              
              // Create View Details Button
              let viewBtn = document.createElement("button");
              viewBtn.classList.add("btn", "btn-outline-success", "btn-sm", "me-2"); // "me-2" adds right margin
              viewBtn.innerHTML = '<i class="bi bi-eye"></i>'; // Bootstrap eye icon
              viewBtn.onclick = () => displayBookDetails(book._id);
              tdAction.appendChild(viewBtn);
    
              // Create Delete Button
              let deleteBtn = document.createElement("button");
              deleteBtn.classList.add("btn", "btn-outline-danger", "btn-sm");
              deleteBtn.innerHTML = '<i class="bi bi-trash"></i>'; // Bootstrap trash icon
              deleteBtn.onclick = () => deleteBook(book._id); // Add your delete function here
              tdAction.appendChild(deleteBtn);
              tr.appendChild(tdAction);
              // Append row to the table body
              tbody.appendChild(tr);
            });
          } else {
            console.info("No books data available");
            let tr = document.createElement("tr");
      
              // Add Sr. No.
              let td = document.createElement("td");
              td.colSpan = 6;
              td.style.textAlign = "center";
              td.innerHTML = "No books data available";
              tr.appendChild(td);
              tbody.appendChild(tr);

          }
    }
    const displayDetails = () => {
        document.querySelector('#post').style.display = 'block'
        document.querySelector('#posts').style.display = 'none'
    }
    const displayBookDetails = async (id) => {
        // Fetch user details by ID
        const book = await getJsonData(`/book/${id}`);
        console.info("book details:", book);
        let cardContent = '';
        // Populate the form with user details
        const bookDetails = book.book; // Assuming response is an array with a single user object
        Object.keys(bookDetails).forEach((key) => {
        
        let value = bookDetails[key];
    
            if(key!='_id')
            {
                if(key=='coverImage')
                {
                    value =  '<img src="'+value+'" width="200">'
                }
            cardContent += `
                <p class="card-text">
                    <strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> <span id="user${key}">${value}</span>
                </p>
            `;
            }    
    
        });
        document.querySelector("#book .card-body").innerHTML = cardContent;
        // Toggle visibility of sections
        document.querySelector("#book").style.display = "block";
        document.querySelector("#books").style.display = "none";       
    }
    


    const deleteBook = async (bookId) => {
        if (confirm("Are you sure you want to delete this book?")) {
          try {
            // Send DELETE request to the server
            const response = await fetch(`/book/${bookId}`, {
              method: "DELETE",
            });
    
            if (response.ok) {
              //console.info("User deleted successfully");
    
              // Re-fetch the users to update the table
              getBooks();
            } else {
              console.error("Failed to delete book", response.statusText);
            }
          } catch (err) {
            console.error("Error while deleting book:", err);
          }
        }
      };



    // Function to capitalize the first letter of the field name
    const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);


    const clearErrors = () => {
        const errorElements = document.querySelectorAll('.error');
        errorElements.forEach(error => error.innerText = '');
    };

    const bookAdd = async (event) => {
        event.preventDefault(); 
        // Get form data
    const formData = new FormData(event.target);
// Log the data being sent to the backend for debugging
for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
}


        try {
            const response = await fetch('/addBook', {
                method: 'POST',
                body: formData
            });
        
            console.log("response="+JSON.stringify(response));
        
            if (response.status==200) {
                // If the response is successful, redirect the user
                window.location.href = '/books.html';  // Example redirect on success
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


    const bookEdit = async (event) => {
        event.preventDefault(); 
        // Get form data
    const formData = new FormData(event.target);
// Log the data being sent to the backend for debugging
// for (let [key, value] of formData.entries()) {
//     console.log(`${key}: ${value}`);
// }



















const response = await fetch('/editBookk', {
    method: 'POST',
    body: formData
});

console.log("response="+JSON.stringify(response));

if (response.status==200) {
    // If the response is successful, redirect the user
    window.location.href = '/books.html';  // Example redirect on success
}

else if (response.status === 400) {
    document.querySelector(
                  "#form-error"
                ).innerHTML = `<div class="alert alert-dismissible alert-danger">${
                    response.msg || "An error occurred. Please try again."
                }</div>`;
 }

else {
    // If response is not OK, handle validation errors
    const errorData = await response.json(); // Parse the response JSON
console.log("errorData="+JSON.stringify(errorData));
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

    const viewBooks = async (users) => {
        document.querySelector("#book").style.display = "none";
        document.querySelector("#books").style.display = "block";
      }


      const editBook = async (bookId) => {
        // Fetch the current book details
        const book = await getJsonData(`/book/${bookId}`);
        const bookDetails = book.book;  // Assuming response is an array with a single book object
    
        // Pre-fill the form fields with existing book data
        Object.keys(bookDetails).forEach((key) => {
            if (key !== '_idd') {
                const inputField = document.querySelector(`#${key}`);
                if (inputField) {
                    if (key === 'coverImage') {
                        
                        document.querySelector("#currentCoverImage").value = `${bookDetails[key]}`;
                        //inputField.innerHTML = `<img src="${bookDetails[key]}" width="200">`;  // Display image for coverImage
                        document.querySelector("#bookImage").src = `${bookDetails[key]}`;
                        
                    } else {
                        inputField.value = bookDetails[key];  // Pre-fill form fields
                    }
                }
            }
        });
    
        // Show the edit form and hide other sections
        document.querySelector("#editBookFormDiv").style.display = "block";
        document.querySelector("#books").style.display = "none";
    }
    



    window.onload = () => {
        viewBooks()
        getBooks()

        document.querySelector("#viewBooks")?.addEventListener("click", viewBooks);
        document.querySelector("#addBookForm")?.addEventListener("submit", bookAdd);
        document.querySelector("#editBookForm")?.addEventListener("submit", bookEdit);

    }
})()
