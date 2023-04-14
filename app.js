const express = require('express')
const cors = require('cors')
require('express-async-errors')
const app = express()

/** Helpers */
const middleware = require('./utils/middleware')

/** Controllers */
const defaultRouter = require('./controllers/default')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

/** Connect to DB */
app.use(middleware.connectToDb)

/** Middlewares */
app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)

/** Routers */
app.use('/', defaultRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

/** Final middlewares */
app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

module.exports = app