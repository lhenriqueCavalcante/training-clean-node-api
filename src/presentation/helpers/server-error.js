class MissingParamError extends Error {
  constructor (paramName) {
    super('Internal error')
    this.name = 'ServerError'
  }
}
module.exports = MissingParamError
