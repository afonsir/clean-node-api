import { AuthMiddleware } from './auth-middleware'
import { LoadAccountByToken, HttpRequest, AccountModel } from './auth-middleware-protocols'
import { AccessDeniedError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { mockAccountModel, throwError } from '@/domain/test'

const mockRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token'
  }
})

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string): Promise<AccountModel> {
      return await Promise.resolve(mockAccountModel())
    }
  }

  return new LoadAccountByTokenStub()
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)

  return {
    sut,
    loadAccountByTokenStub
  }
}

describe('Auth Middleware', () => {
  test('should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('should call LoadAccountByToken with correct accessToken', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenStub } = makeSut(role)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')

    await sut.handle(mockRequest())

    expect(loadSpy).toHaveBeenCalledWith('any_token', role)
  })

  test('should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()

    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(Promise.resolve(null))

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(ok({ accountId: 'any_id' }))
  })

  test('should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()

    jest.spyOn(loadAccountByTokenStub, 'load').mockImplementationOnce(throwError)

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
