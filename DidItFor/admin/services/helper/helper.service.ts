import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class AdminHelperService {
  constructor() { }

  public formatDateToView(date: string): string {
    if (moment(date).isValid()) {
      return moment(date).format('ll');
    }
  }

  public formatDateToSending(date: any): string {
    return moment(date).format();
  }

  public withinCancelPeriod(date: string): boolean {
    return moment().diff(moment(date), 'days') < 14;
  }

  public sessionPeriod(date: string): number {
    return moment().diff(moment(date), 'days');
  }

  public endOfDay(date: any): string {
    return this.formatDateToSending(moment(date).endOf('day'));
  }

  public formatCentsToDollars(cents: number): string {
    let dollars: number;
    dollars = parseFloat((cents / 100).toFixed(2));
    return '$' + dollars;
  }

  public getCentsFromDollar(dollar: number): number {
    return parseFloat((dollar * 100).toFixed(2));
  }

  public getParams(params: object): object {
    const paramsNotEmpty = {};
    Object.keys(params).forEach(param => {
      if (params[param]) {
        paramsNotEmpty[param] = params[param];
      }
    })
    return paramsNotEmpty;
  }
}
