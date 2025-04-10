//Create immediately invoked function

(() => {
    const Query = (name, email, phone, message) => {
        return {
            name: name,
            email: email,
            phone: phone,
            message: message,
            // created_on: new Date().toUTCString() // You can add a timestamp if necessary
        };
    }
    module.exports = Query
})()



