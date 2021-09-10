const LoginRouter = require('../../../src/presentation/routers/login-router')

const MissingParamError = require('../../../src/presentation/helpers/missing-param-error')
const InvalidParamError = require('../../../src/presentation/helpers/invalid-param-error')
const UnauthorizedError = require('../../../src/presentation/helpers/unauthorized-error')
const ServerError = require('../../../src/presentation/helpers/server-error')

const { AuthUseCaseMock, AuthUseCaseMockWithError } = require('../../mocks/auth-use-case-mock')
const { EmailValidatorMock, EmailValidatorMockWithError } = require('../../mocks/email-validator-mock')

const makeSut = () => {
  const authUseCaseMock = new AuthUseCaseMock()
  const emailValidatorMock = new EmailValidatorMock()
  const sut = new LoginRouter(authUseCaseMock, emailValidatorMock)
  return { authUseCaseMock, emailValidatorMock, sut }
}

describe('Login Router', () => {
  test('should return 200 when valid credentials are provided', async () => {
    const { sut, authUseCaseMock } = makeSut()
    authUseCaseMock.accessToken = 'any_token'
    const httpRequest = {
      body: {
        email: 'valid_email@mail.com',
        password: 'valid_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.accessToken).toEqual(authUseCaseMock.accessToken)
  })

  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('Email'))
  })

  test('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('Password'))
  })

  test('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorMock } = makeSut()
    emailValidatorMock.isEmailValid = false
    const httpRequest = {
      body: {
        email: 'invalid_email@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('Email'))
  })

  test('should return 401 when invalid credentials are provided', async () => {
    const { sut, authUseCaseMock } = makeSut()
    authUseCaseMock.accessToken = null
    const httpRequest = {
      body: {
        email: 'invalid_email@mail.com',
        password: 'invalid_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  test('should return 500 if no httpRequest is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should return 500 if httpRequest has no body', async () => {
    const { sut } = makeSut()
    const httpRequest = {
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should return 500 if no AuthUseCase is provided', async () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'valid_email@mail.com',
        password: 'valid_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should return 500 if no EmailValidator is provided', async () => {
    const { authUseCaseMock } = makeSut()
    const sut = new LoginRouter(authUseCaseMock)
    const httpRequest = {
      body: {
        email: 'valid_email@mail.com',
        password: 'valid_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should return 500 if AuthUseCase throws', async () => {
    const authUseCaseWithError = new AuthUseCaseMockWithError()
    const emailValidatorMock = new EmailValidatorMock()

    const sut = new LoginRouter(authUseCaseWithError, emailValidatorMock)
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })

  test('should return 500 if EmailValidator throws', async () => {
    const emailValidatorMockWithError = new EmailValidatorMockWithError()
    const authUseCase = new AuthUseCaseMock()

    const sut = new LoginRouter(authUseCase, emailValidatorMockWithError)
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })

  test('should call AuthUseCase with correct params', async () => {
    const { sut, authUseCaseMock } = makeSut()
    const authUseCaseSpy = jest.spyOn(authUseCaseMock, 'auth')

    const email = 'valid_email@mail.com'
    const password = 'valid_password@mail.com'
    const httpRequest = {
      body: {
        email,
        password
      }
    }
    await sut.route(httpRequest)
    expect(authUseCaseSpy).toHaveBeenCalledWith(email, password)
  })

  test('should call EmailValidator with correct param', async () => {
    const { sut, emailValidatorMock } = makeSut()
    const emailValidatorMockSpy = jest.spyOn(emailValidatorMock, 'isValid')

    const email = 'valid_email@mail.com'
    const password = 'valid_password@mail.com'
    const httpRequest = {
      body: {
        email,
        password
      }
    }
    await sut.route(httpRequest)
    expect(emailValidatorMockSpy).toHaveBeenCalledWith(email)
  })
})
