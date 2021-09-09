const HttpResponse = require('../helpers/http-response')

class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  route (httpRequest) {
    if (!httpRequest || !httpRequest.body || !this.authUseCase) return HttpResponse.serverError()

    const { email, password } = httpRequest.body
    if (!email) {
      return HttpResponse.badRequest('Email')
    }
    if (!password) {
      return HttpResponse.badRequest('Password')
    }

    const accessToken = this.authUseCase.auth(email, password)

    if (!accessToken) {
      return HttpResponse.unauthorizedError()
    }
    return HttpResponse.ok({ accessToken })
  }
}

module.exports = LoginRouter
