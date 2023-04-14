/** Avoid  'Jest did not exit one second after the test run has completed.' error after running tests
 * also add in package.json:
 * "jest": {
        "testEnvironment": "node",
        "globalTeardown": "./test/teardown.js"
    }
*/

module.exports = () => {
    process.exit(0)
}