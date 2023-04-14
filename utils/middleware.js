const logger = require('./logger')
const jwt = require('jsonwebtoken')
const config = require('./config')
const mongoose = require('mongoose')

const connectToDb = async (request, response, next) => {
    logger.info('** Connecting to:', config.MONGODB_URI)
    mongoose.set('strictQuery', false)
    try {
        await mongoose.connect(config.MONGODB_URI)
        logger.info('** Connected to MongoDB')

    } catch (error) {
        logger.error('** Error connecting to MongoDB:', error.message)
    }

    next()
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        const TOKEN = authorization.replace('Bearer ', '')
        response.token = TOKEN
    }

    next()
}

const userExtractor = (request, response, next) => {
    const decodedToken = jwt.verify(response.token, process.env.SECRET)
    if (decodedToken.username && decodedToken.id) {
        const USER = {
            username: decodedToken.username,
            id: decodedToken.id
        }
        request.user = USER
    }

    next()
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)
    if (error.name === 'CastError') {
        return response
            .status(400) // Bad Request
            .send({
                error: '** Malformatted Field'
            })
    } else if (error.name === 'ValidationError') {
        return response
            .status(400) // Bad Request
            .json({
                error: error.message
            })
    } else if (error.name === 'JsonWebTokenError') {
        return response
            .status(401) // Unauthorized
            .json({
                error: '** Invalid Token'
            })
    } else if (error.name === 'TokenExpiredError') {
        return response
            .status(401) // Unauthorized
            .json({
                error: '** Token Expired'
            })
    } else if (error.name === 'MongoError' && error.code === 11000) {
        return response
            .status(400) // Bad Request
            .json({
                error: '** Duplicate Key'
            })
    } else if (error.name === 'ReferenceError') {
        return response
            .status(400) // Bad Request
            .json({
                error: '** Reference Error'
            })
    } else if (error.name === 'TypeError') {
        return response
            .status(400) // Bad Request
            .json({
                error: error.message
            })
    }

    next(error)
}

const unknownEndpoint = (request, response) => {
    return response
        .status(404) // Not Found
        .send({
            error: '** Unknown Endpoint'
        })
}

module.exports = {
    connectToDb,
    userExtractor,
    tokenExtractor,
    errorHandler,
    unknownEndpoint
}