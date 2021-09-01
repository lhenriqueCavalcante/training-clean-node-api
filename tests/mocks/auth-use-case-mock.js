class AuthUseCaseMock {
  auth (email, password) {
    this.email = email
    this.password = password
  }
}

module.exports = AuthUseCaseMock
