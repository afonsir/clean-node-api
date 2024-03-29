import { Validation } from '@/presentation/controllers/login/login/login-controller-protocols'
import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators'

export const makeAddSurveyValidation = (): ValidationComposite => {
  const validations: Validation[] = []

  for (const field of ['question', 'answers']) {
    validations.push(new RequiredFieldValidation(field))
  }

  return new ValidationComposite(validations)
}
