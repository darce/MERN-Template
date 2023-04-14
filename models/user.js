const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        minlength: 3,
        required: true,
        unique: true // needs to be reset with 'await User.syncIndexes()'. 'unique: false' will not work.
    },
    passwordHash: {
        type: String,
        required: true
    }
    /**
     * Linked collections example:
     * blogs: [
     *  {
     *      type: mongoose.Schema.Types.ObjectId,
     *      ref: 'Blog'
     *  }
     * ]
     */
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        /** Do not reveal passwordHash */
        delete returnedObject.passwordHash
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User