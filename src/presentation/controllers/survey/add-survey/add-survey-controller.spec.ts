import { AddSurvey, AddSurveyModel, HttpRequest, Validation } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper'
import MockDate from 'mockdate'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }

  return new ValidationStub()
}

const makeAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyModel): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }

  return new AddSurveyStub()
}

type SutTypes = {
  sut: AddSurveyController
  validationStub: Validation
  AddSurveyStub: AddSurvey
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const AddSurveyStub = makeAddSurvey()
  const sut = new AddSurveyController(validationStub, AddSurveyStub)

  return {
    sut,
    validationStub,
    AddSurveyStub
  }
}

describe('AddSurvey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  test('should call AddSurvey with correct values', async () => {
    const { sut, AddSurveyStub } = makeSut()
    const addSpy = jest.spyOn(AddSurveyStub, 'add')
    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 500 if AddSurvey throws', async () => {
    const { sut, AddSurveyStub } = makeSut()

    jest.spyOn(AddSurveyStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(noContent())
  })
})
