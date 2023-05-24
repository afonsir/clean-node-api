import { SaveSurveyResultRepository, SurveyResultModel, SaveSurveyResult, SaveSurveyResultModel } from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (private readonly saveSurveyResultRepository: SaveSurveyResultRepository) {}

  async save (surveyResultData: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResult = await this.saveSurveyResultRepository.save(surveyResultData)
    return surveyResult
  }
}
