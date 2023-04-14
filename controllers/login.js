const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body

    const user = await User.find({ username })
    const isPasswordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user[0].passwordHash)

    if (!(user && isPasswordCorrect)) {
        return response
            .status(401) // Unauthorized
            .json({
                error: 'Invalid username or password'
            })
    }

    const userForToken = {
        username: user.username,
        id: user._id
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    response
        .status(200) // OK
        .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter