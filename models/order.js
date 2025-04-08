//Create immediately invoked function

(() => {
    const Order = (userId, userRole, name,email,shippingAddress,subtotal,shipping,total,cart) => {
        return {
            userId: userId,
            userRole: userRole,
            name: name,
            email: email,
            shippingAddress: shippingAddress,
            subtotal: subtotal,
            shipping: shipping,
            total: total,
            
            cart: cart,
            since: new Date().toUTCString()
        }
    }
    module.exports = Order
})()



