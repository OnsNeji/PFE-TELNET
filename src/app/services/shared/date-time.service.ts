import { Injectable } from '@angular/core';
import * as moment from 'moment';
const localCode = 'fr';

@Injectable()
export class DateTimeService {
  nullDate: any = '0001-01-01T00:00:00+01:00';
  nullDate2: any = '0001-01-01T00:00:00';
  startOfWeek = moment().startOf('isoWeek');
  endOfWeek = moment().endOf('isoWeek');

  isNullDate(date): boolean {
    return date === null || date === undefined || date === this.nullDate || date === this.nullDate2;
  }

  getShortestFormat(date: Date): string {
    if (this.isNullDate(date)) {
      return '';
    } else {
      return moment(date).format('DD/MM');
    }
  }

  getShortFormat(date: any): string {
    if (this.isNullDate(date)) {
      return '';
    } else {
      return moment(date).locale(localCode).format('L');
    }
  }

  getShortFormatWithDay(date: Date): string {
    if (this.isNullDate(date)) {
      return '';
    } else {
      const d = moment(date).locale(localCode);
      return d.format('dddd') + ' ' + d.format('L');
    }
  }

  getShortestFormatWithTime(date: Date): string {
    if (this.isNullDate(date)) {
      return '';
    } else {
      return moment(date).format('DD/MM-HH:mm');
    }
  }

  getDayName(date: Date | moment.Moment): string {
    if (!this.isNullDate(date)) {
      return moment(date).locale(localCode).format('dddd');
    } else {
      return '';
    }
  }

  FormatDateToString(dateToFormat: any): string {
    return dateToFormat.isValid() ? dateToFormat.locale(localCode).format('L') : '';
  }

  GetDate(dateToFormat: string): string {
    return moment(new Date(dateToFormat)).isValid() ? moment(new Date(dateToFormat)).locale(localCode).format('L') : '';
  }

  ConvertDateToNumber(dateToFormat): number {
    return moment(dateToFormat).valueOf();
  }

  getMaxDate(day1, day2) {
    if (this.isNullDate(day1)) {
      return day2;
    }
    if (this.isNullDate(day2)) {
      return day1;
    }
    // Initiallize variables
    const d1 = moment(day1);
    const d2 = moment(day2);
    if (d1.isBefore(d2)) {
      return day2;
    } else {
      return day1;
    }
  }

  getMinDate(day1, day2) {
    if (this.isNullDate(day1)) {
      return day2;
    }
    if (this.isNullDate(day2)) {
      return day1;
    }
    // Initiallize variables
    const d1 = moment(day1);
    const d2 = moment(day2);
    if (d1.isAfter(d2)) {
      return day2;
    } else {
      return day1;
    }
  }

  today() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  getCurrentMonth() {
    return moment().startOf('month');
  }

  getDiff(date1, date2) {
    const d1 = moment(date1).valueOf();
    const d2 = moment(date2).valueOf();
    return d1 - d2;
  }

  getSum(date1, date2) {
    const d1 = moment(date1).valueOf();
    const d2 = moment(date2).valueOf();
    return d1 + d2;
  }

  getDate(date) {
    return moment(date);
  }

  getBusinessDays(startDate, endDate, lastDayIncluded = true) {
    // Initiallize variables
    let day1 = moment(startDate);
    let day2 = moment(endDate);
    day1.locale('fr');
    day2.locale('fr');
    let adjust = lastDayIncluded ? 1 : 0;
    if (day1.weekday() === 5 && day2.weekday() === 6 && day2.diff(day1, 'days') === 1) {
      return 0;
    }
    if (day1.weekday() === 5 && day2.weekday() === 5 && day2.diff(day1, 'days') === 0) {
      return 0;
    }
    if (day1.weekday() === 6 && day2.weekday() === 6 && day2.diff(day1, 'days') === 0) {
      return 0;
    }
    if ((day1.dayOfYear() === day2.dayOfYear()) && (day1.year() === day2.year())) {
      return 1;
    }
    // Check if second date is before first date to switch
    if (day2.isBefore(day1)) {
      day2 = moment(startDate);
      day1 = moment(endDate);
    }
    // Check if first date starts on weekends
    if (day1.day() === 6) { // Saturday
      // Move date to next week monday
      day1.day(8);
    } else if (day1.day() === 0) { // Sunday
      // Move date to current week monday
      day1.day(1);
    }
    // Check if second date starts on weekends
    if (day2.day() === 6) { // Saturday
      // Move date to current week friday
      day2.day(5);
    } else if (day2.day() === 0) { // Sunday
      // Move date to previous week friday
      day2.day(-2);
    }
    const day1Week = day1.week();
    let day2Week = day2.week();
    // Check if second date's year is different from first date's year
    if (day2Week < day1Week) {
      day2Week += day1Week;
    }
    // Calculate adjust value to be substracted from difference between two dates
    adjust = -2 * (day2Week - day1Week) + 1;
    return (day2.diff(day1, 'days') + adjust);
  }

  isBefore(date1, date2) {
    date1 = moment(date1);
    date2 = moment(date2);
    return date1.isBefore(date2);
  }

  isAfter(date1, date2) {
    date1 = moment(date1);
    date2 = moment(date2);
    return date1.isAfter(date2);
  }

  areEqual(date1, date2) {
    date1 = moment(date1);
    date2 = moment(date2);
    return ((date1.dayOfYear() === date2.dayOfYear()) && (date1.year() === date2.year()));
  }

  getWeekNumber(date = this.today()) {
    return moment(date).week();
  }

  getWeekDays(date = this.today()) {
    const startOfWeek = moment(date).startOf('isoWeek');
    const endOfWeek = moment(date).endOf('isoWeek');
    let day = startOfWeek;
    const days = [];
    while (day <= endOfWeek) {
      days.push(this.FormatDateToString(day));
      day = day.clone().add(1, 'd');
    }
    return (days);
  }

  dateOnly(date): boolean {
    const charCode = (date.which) ? date.which : date.keyCode;
    if (charCode > 31 && (charCode < 47 || charCode > 57)) {
      return false;
    }
    return true;
  }

  getFirstDayFromPreviousMonth() {
    const previousDate = new Date();
    previousDate.setMonth(previousDate.getMonth() - 1);
    return new Date(previousDate.getFullYear(), previousDate.getMonth(), 1);
  }

}
