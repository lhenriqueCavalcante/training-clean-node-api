const LoginRouter = require('../../../src/presentation/routers/login-router')
const MissingParamError = require('../../../src/presentation/helpers/missing-param-error')
const UnauthorizedError = require('../../../src/presentation/helpers/unauthorized-error')
const ServerError = require('../../../src/presentation/helpers/server-error')

const { AuthUseCaseMock, AuthUseCaseMockWithError } = require('../../mocks/auth-use-case-mock')

const makeSut = () => {
  const authUseCaseMock = new AuthUseCaseMock()
  const sut = new LoginRouter(authUseCaseMock)
  return { authUseCaseMock, sut }
}

describe('Login Router', () => {
  test('should return 200 when valid credentials are provided', () => {
    const { sut, authUseCaseMock } = makeSut()
    authUseCaseMock.accessToken = 'any_token'
    const httpRequest = {
      body: {
        email: 'valid_email@mail.com',
        password: 'valid_password'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.accessToken).toEqual(authUseCaseMock.accessToken)
  })

  test('should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('Email'))
  })

  test('should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('Password'))
  })

  test('should return 401 when invalid credentials are provided', () => {
    const { sut, authUseCaseMock } = makeSut()
    authUseCaseMock.accessToken = null
    const httpRequest = {
      body: {
        email: 'invalid_email@mail.com',
        password: 'invalid_password'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  test('should return 500 if no httpRequest is provided', () => {
    const { sut } = makeSut()
    const httpResponse = sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should return 500 if httpRequest has no body', () => {
    const { sut } = makeSut()
    const httpRequest = {
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should return 500 if no AuthUseCase is provided', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'invalid_email@mail.com',
        password: 'invalid_password'
      }
    }

    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should return 500 if AuthUseCase throws', () => {
    const authUseCaseWithError = new AuthUseCaseMockWithError()
    const sut = new LoginRouter(authUseCaseWithError)
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }

    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })

  test('should call AuthUseCase with correct params', () => {
    const { sut, authUseCaseMock } = makeSut()
    const authUseCaseSpy = jest.spyOn(authUseCaseMock, 'auth')

    const email = 'invalid_email@mail.com'
    const password = 'invalid_password@mail.com'
    const httpRequest = {
      body: {
        email,
        password
      }
    }
    sut.route(httpRequest)
    expect(authUseCaseSpy).toHaveBeenCalledWith(email, password)
  })
})
