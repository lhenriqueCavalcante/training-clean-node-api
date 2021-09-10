class AuthUseCaseMock {
  constructor () {
    this.accessToken = 'any_token'
  }

  async auth (email, password) {
    this.email = email
    this.password = password
    return this.accessToken
  }
}

class AuthUseCaseMockWithError {
  async auth () {
    throw new Error()
  }
}

module.exports = { AuthUseCaseMock, AuthUseCaseMockWithError }
