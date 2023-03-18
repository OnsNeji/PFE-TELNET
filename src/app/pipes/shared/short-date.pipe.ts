import { Pipe, PipeTransform } from '@angular/core';
import { DateTimeService } from 'app/services/shared';

@Pipe({
  name: 'shortDate'
})
export class ShortDatePipe implements PipeTransform {
  constructor(private dtService: DateTimeService) { }

  transform(value: any, withDay?: string): any {
    if ((value === null || value === undefined) || value === '0001-01-01T00:00:00') {
      return '';
    }
    if (withDay === 'day') {
      return this.dtService.getShortFormatWithDay(value);
    } else {
      return this.dtService.getShortFormat(value);
    }
  }
}
