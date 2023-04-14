const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({})

    response.json(users)
})

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    /** Password must be validated in the controller
     * Not in the mongoose model */
    if(!password || password.length < 3) {
        return response
            .status(400) // Bad Request
            .json({
                error: 'Password must be at least 3 characters long'
            })
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = new User({
        username,
        name,
        passwordHash
    })
    const savedUser = await user.save()
    response
        .status(201) // Created
        .json(savedUser)
})

module.exports = usersRouter