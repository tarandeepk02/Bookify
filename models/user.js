(() => {
    const User = (name, email, hashed, picture) => {
        const Role = {
            ADMIN: 'admin',
            MEMBER: 'member',
            GUEST: 'guest'
        }
        return {
            name: name,
            email: email,
            password: hashed,
            picture: picture,
            role: Role.MEMBER,
            since: new Date().toUTCString()
        }
    }
    module.exports = User
})()