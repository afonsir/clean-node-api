import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'

export class LogMongoRepository implements LogErrorRepository {
  async logError (stack: string): Promise<void> {
    const erroCollection = await MongoHelper.getCollection('errors')
    await erroCollection.insertOne({
      stack,
      date: new Date()
    })
  }
}
