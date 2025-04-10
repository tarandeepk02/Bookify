//Create immediately invoked function

(() => {
    const Book = (title, authors, isbn, publisher, publishedDate, genre, description, coverImage, price, rating) => {
        return {
            title: title,
            authors: authors,
            isbn: isbn,
            publisher: publisher,
            publishedDate: publishedDate,
            genre: genre,
            description: description,
            coverImage: coverImage,
            price: price,
            rating: rating,
            since: new Date().toUTCString()
        }
    }
    module.exports = Book
})()



