class UnauthorizedError extends Error {
  constructor () {
    super('Unauthorized')
    this.name = 'unauthorizedError'
  }
}
module.exports = UnauthorizedError
