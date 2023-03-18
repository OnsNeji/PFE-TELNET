import { AbstractControlDirective, AbstractControl } from '@angular/forms';

export class ShowErrorsService {

  private static readonly errorMessages = {
    'required': () => 'This field is required',
    'min': (params) => 'The min value allowed is ' + params.min,
    'minlength': (params) => 'The min number of characters is ' + params.requiredLength,
    'max': (params) => 'The max value allowed is ' + params.max,
    'maxlength': (params) => 'The max allowed number of characters is ' + params.requiredLength,
    'pattern': (params) => 'The required pattern is: ' + params.requiredPattern,
    'numeric': (params) => params.message,
    'startDateInvalid': (params) => params.message,
    'endDateInvalid': (params) => params.message,
    'childStartDate': () => 'Invalid value, please check childs\'s \'Start Date\'',
    'childEndDate': () => 'Invalid value, please check childs\'s \'End Date\'',
    'assingnmentStartDate': () => 'Invalid value, please check assignments\'s \'Start Date\'',
    'assingnmentEndDate': () => 'Invalid value, please check assignments\'s \'End Date\'',
    'parentStartDate': () => 'Invalid value, please check parent\'s \'Start Date\'',
    'activityStartDate': () => 'Invalid value, please check activity \'Start Date\'',
    'activityEndDate': () => 'Invalid value, please check activity \'End Date\'',
    'parentEndDate': () => 'Invalid value, please check parent\'s \'End Date\'',
    'plannedStartDate': () => '\'Start Date\' can\'t be greater than \'End Date\'',
    'plannedEndDate': () => '\'End Date\' can\'t be less than \'Start Date\'',
    'matDatepickerMin': (params) => params.message,
    'matDatepickerMax': (params) => params.message

  };

  hasError(control: AbstractControlDirective | AbstractControl): boolean {
    return control &&
      control.errors &&
      (control.dirty || control.touched);
  }

  getErrors(control: AbstractControlDirective | AbstractControl): string[] {
    return Object.keys(control.errors)
      .map(field => this.getMessage(field, control.errors[field]));
  }

  private getMessage(type: string, params: any) {
    try {
      return ShowErrorsService.errorMessages[type](params);
    } catch {
      return null;
    }
  }

}
