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

class AuthUseCaseMockWithError {
  auth () {
    throw new Error()
  }
}

module.exports = { AuthUseCaseMock, AuthUseCaseMockWithError }
