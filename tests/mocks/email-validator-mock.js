class EmailValidatorMock {
  constructor () {
    this.isEmailValid = true
  }

  isValid (email) {
    return this.isEmailValid
  }
}

module.exports = EmailValidatorMock
