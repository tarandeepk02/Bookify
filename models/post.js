//Create immediately invoked function

(() => {
    const Post = (topic, message, by) => {
        return {
            Topic: topic,
            Message: message,
            By: by,
            At: new Date().toUTCString()
        }
    }
    module.exports = Post
})()



