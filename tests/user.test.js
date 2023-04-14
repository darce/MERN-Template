const app = require('../app')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const User = require('../models/user')

/** Create superagent object for API testing */
const api = supertest(app)

describe('user tests', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        /** Remove unique indexes if they have been set previously.
         * Fixes MongoError: 'E11000 duplicate key error collection' error.
         */
        // await User.syncIndexes()

        const passwordHash = await bcrypt.hash('secret', 10)
        const user = new User({
            username: 'root',
            name: 'Superuser',
            passwordHash
        })
        await user.save()
    }, 10000)

    test('login using existing user', async () => {
        const user = {
            username: 'root',
            password: 'secret'
        }
        const authUser = await api
            .post('/api/login')
            .send(user)
            .expect(200)

        expect(authUser.body.username).toBe(user.username)
    })
})
