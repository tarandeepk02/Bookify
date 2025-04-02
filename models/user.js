(() => {
    const User = (username, hashed) => {
        const Role = {
            ADMIN: 'admin',
            MEMBER: 'member',
            GUEST: 'guest'
        }
        return {
            username: username,
            password: hashed,
            role: Role.MEMBER,
            since: new Date().toUTCString()
        }
    }
    module.exports = User
})()