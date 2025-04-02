(() => {
    const config = {}
    config.PORT = process.env.PORT || 8080
    config.ROOT = 'views'
    config.LOG_FILE = 'server/log/node.js.log'
    module.exports = config

})()

