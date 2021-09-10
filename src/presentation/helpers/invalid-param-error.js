class InvalidParamError extends Error {
  constructor (paramName) {
    super(`Invalid param: ${paramName}`)
    this.name = 'unauthorizedError'
  }
}
module.exports = InvalidParamError
