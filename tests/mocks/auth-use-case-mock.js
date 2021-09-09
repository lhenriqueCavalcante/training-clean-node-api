class AuthUseCaseMock {
  constructor () {
    this.accessToken = 'any_token'
  }

  auth (email, password) {
    this.email = email
    this.password = password
    return this.accessToken
  }
}

module.exports = AuthUseCaseMock
