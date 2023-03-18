import { Component, Output, EventEmitter, OnInit, Input, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';

const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-select-month',
  templateUrl: 'select-month.component.html',
  styleUrls: ['select-month.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

export class SelectMonthComponent implements OnInit, OnChanges {
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
    this.updateSelectedDate();
  }

  ngOnChanges() {
    this.updateSelectedDate();
  }

  updateSelectedDate() {
    if (this.selectedDate) {
      this.selectedDate = new Date(this.selectedDate);
      this.date.setValue(moment([this.selectedDate.getFullYear(), this.selectedDate.getMonth()]));
    }
  }

  chosenYearHandler(normalizedYear: _moment.Moment) {
    if ((this.minDate == null || normalizedYear >= moment(this.minDate)) &&
      (this.maxDate == null || normalizedYear <= moment(this.maxDate))) {
      this.date.setValue(normalizedYear);
      this.daysChange.emit(this.date.value);
    }
  }

  chosenMonthHandler(normalizedMonth: _moment.Moment, datepicker: MatDatepicker<_moment.Moment>) {
    if ((this.minDate == null || normalizedMonth >= moment(this.minDate)) &&
      (this.maxDate == null || normalizedMonth <= moment(this.maxDate))) {
      this.date.setValue(normalizedMonth);
      this.daysChange.emit(this.date.value);
    }
    if (datepicker) {
      datepicker.close();
    }
  }

  previousMonth(event) {
    if (this.minDate !== undefined) {
      if (this.date.value <= this.minDate) {
        event.stopPropagation();
        event.preventDefault();
        return false;
      }
    }
    this.date.setValue(moment(this.date.value.subtract(1, 'months').startOf('month')));
    this.daysChange.emit(this.date.value);
  }

  nextMonth(event) {
    if (this.maxDate !== undefined) {
      const date = moment(this.date.value).endOf('month').toDate();
      if (date >= this.maxDate) {
        event.stopPropagation();
        event.preventDefault();
        return false;
      }
    }
    this.date.setValue(moment(this.date.value.add(1, 'months').startOf('month')));
    this.daysChange.emit(this.date.value);
  }
}
