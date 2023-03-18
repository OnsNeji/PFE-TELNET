import { FormControl, ValidationErrors } from '@angular/forms';
import { Injectable } from '@angular/core';
import { DateTimeService } from 'app/services/shared';

@Injectable()
export class CustomValidators {
  static dateTimeService = new DateTimeService();

  static numeric(c: FormControl): ValidationErrors {
    const numValue = Number(c.value);
    const isValid = !isNaN(numValue);
    const message = {
      'numeric': {
        'message': 'Only numeric values are acecpted'
      }
    };
    return isValid ? null : message;
  }

  static checkDates(d1: FormControl, d2: FormControl, source: string): ValidationErrors {
    const startDate = d1.value;
    const endDate = d2.value;
    let message = {};
    const isValid = CustomValidators.dateTimeService.isBefore(startDate, endDate);
    if (!isValid) {
      if (source === 'start') {
        message = {
          'startDateInvalid': {
            'message': 'Start Date must be lower than End Date.'
          }
        };
      } else {
        message = {
          'endDateInvalid': {
            'message': 'End Date must be greater than Start Date.'
          }
        };
      }
    }

    return isValid ? null : message;
  }
}
