import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';

const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    yearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    yearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-select-year',
  templateUrl: 'select-year.component.html',
  styleUrls: ['select-year.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

export class SelectYearComponent implements OnInit {
  constructor() {
    // do nothing
  }
  date = new FormControl(moment());
  weeksFirstDate: Date[];
  @Output() daysChange = new EventEmitter<any[]>();
  @Input() maxDate: Date;
  @Input() minDate: Date;
  @Input() selectedDate: Date;

  ngOnInit() {
    if (this.selectedDate) {
      this.selectedDate = new Date(this.selectedDate);
      this.date.setValue(moment([this.selectedDate.getFullYear()]));
    }
  }

  chosenYearHandler(normalizedYear: _moment.Moment, datepicker: MatDatepicker<_moment.Moment>) {
    if ((this.minDate == null || normalizedYear >= moment(this.minDate)) &&
      (this.maxDate == null || normalizedYear <= moment(this.maxDate))) {
      this.date.setValue(normalizedYear);
      this.daysChange.emit(this.date.value);
    }
    if (datepicker) {
      datepicker.close();
    }
  }

  previousYear(event) {
    if (this.minDate !== undefined) {
      if (this.date.value <= this.minDate) {
        event.stopPropagation();
        event.preventDefault();
        return false;
      }
    }
    this.date.setValue(moment(this.date.value.subtract(1, 'years').startOf('year')));
    this.daysChange.emit(this.date.value);
  }

  nextYear(event) {
    if (this.maxDate !== undefined) {
      const date = moment(this.date.value).endOf('year').toDate();
      if (date >= this.maxDate) {
        event.stopPropagation();
        event.preventDefault();
        return false;
      }
    }
    this.date.setValue(moment(this.date.value.add(1, 'years').startOf('year')));
    this.daysChange.emit(this.date.value);
  }
}
