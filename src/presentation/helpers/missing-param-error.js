class UnauthorizedError extends Error {
  constructor (paramName) {
    super('Unauthorized')
    this.name = 'unauthorizedError'
  }
}
module.exports = UnauthorizedError
