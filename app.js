const express = require('express')
const mongoose = require('mongoose')
const app = express()

/** Helpers */
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

/** Controllers */
const defaultRouter = require('./controllers/default')

/** Connect to DB */
logger.info('** Connecting to:', config.MONGODB_URI)
mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('** Connected to MongoDB')
    })
    .catch((error) => {
        logger.error('** Error connecting to MongoDB:', error.message)
    })

/** Middlewares */
app.use(express.json())

/** Routers */
app.use('/', defaultRouter)

/** Last middlewares */
app.use(middleware.unknownEndpoint)

module.exports = app