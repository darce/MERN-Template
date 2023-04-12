const unknownEndpoint = (request, response) => {
    return response
        .status(404) // Not Found
        .send({
            error: '** Unknown Endpoint'
        })

}

module.exports = {
    unknownEndpoint
}