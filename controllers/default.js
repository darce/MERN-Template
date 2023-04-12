const defaultRouter = require('express').Router()

defaultRouter.get('/', (request, response) => {
    return response.send('<h1>Default Router</h1>')
})

module.exports = defaultRouter