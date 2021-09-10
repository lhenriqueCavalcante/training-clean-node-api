class EmailValidatorMock {
  constructor () {
    this.isEmailValid = true
  }

  isValid (email) {
    return this.isEmailValid
  }
}

class EmailValidatorMockWithError {
  isValid () {
    throw new Error()
  }
}

module.exports = { EmailValidatorMock, EmailValidatorMockWithError }
