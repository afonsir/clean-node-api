import { SaveSurveyResultRepository, SurveyResultModel, SaveSurveyResult, SaveSurveyResultParams } from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (private readonly saveSurveyResultRepository: SaveSurveyResultRepository) {}

  async save (surveyResultData: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResult = await this.saveSurveyResultRepository.save(surveyResultData)
    return surveyResult
  }
}
