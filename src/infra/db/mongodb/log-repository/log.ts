import { LogErrorRepository } from '../../../../data/protocols/log-error-repository'
import { MongoHelper } from '../helpers/mongo-helper'

export class LogMongoRepository implements LogErrorRepository {
  async logError (stack: string): Promise<void> {
    const erroCollection = await MongoHelper.getCollection('errors')
    await erroCollection.insertOne({
      stack,
      date: new Date()
    })
  }
}
