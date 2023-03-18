import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as _moment from 'moment';

const moment = _moment;

export const year_FORMATS = {
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
  selector: 'app-input-year',
  templateUrl: 'input-year.component.html',
  styleUrls: ['input-year.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: year_FORMATS },
  ],
})

export class InputYearComponent implements OnChanges {
  constructor(private fb: FormBuilder) { }
  form: FormGroup;
  inputtedDate = new FormControl(moment());
  @Output() yearChange = new EventEmitter<any[]>();
  @Input() year: number;
  @Input() maxDate: Date;
  @Input() minDate: Date;
  @Input() enabled: boolean;
  @Input() displayPlaceHolder = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.form === undefined) {
      this.form = this.fb.group({
        yearInput: this.inputtedDate
      });
    }
    if (this.enabled) {
      this.form.get('yearInput').enable();
    } else {
      this.form.get('yearInput').disable();
    }
    if (this.year !== undefined) {
      this.inputtedDate.setValue(moment([this.year]));
    } else {
      this.inputtedDate.setValue(moment([new Date().getFullYear()]));
    }
}

  chosenYearHandler(normalizedYear: _moment.Moment, datepicker: MatDatepicker<_moment.Moment>) {
    if ((this.minDate == null || normalizedYear >= moment(this.minDate)) &&
      (this.maxDate == null || normalizedYear <= moment(this.maxDate))) {
      this.inputtedDate.setValue(normalizedYear);
      this.yearChange.emit(this.inputtedDate.value);
    }
    if (datepicker) {
      datepicker.close();
    }
  }
  dateOnly(date): boolean {
    const charCode = (date.which) ? date.which : date.keyCode;
    if (charCode > 31 && (charCode < 47 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onChange() {
    this.yearChange.emit(this.inputtedDate.value);
  }
}
