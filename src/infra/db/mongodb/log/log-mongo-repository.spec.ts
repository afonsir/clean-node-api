import { LogMongoRepository } from './log-mongo-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { Collection } from 'mongodb'

const makeSut = (): LogErrorRepository => {
  return new LogMongoRepository()
}

describe('Log Mongo Repository', () => {
  let errorCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  test('should create an error on success', async () => {
    const sut = makeSut()

    await sut.logError('any_stack')

    const count = await errorCollection.countDocuments()

    expect(count).toBe(1)
  })
})
