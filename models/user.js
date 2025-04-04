(() => {
    const User = (name,email, hashed) => {
        const Role = {
            ADMIN: 'admin',
            MEMBER: 'member',
            GUEST: 'guest'
        }
        return {
            name: name,
            email: email,
            password: hashed,
            role: Role.MEMBER,
            since: new Date().toUTCString()
        }
    }
    module.exports = User
})()