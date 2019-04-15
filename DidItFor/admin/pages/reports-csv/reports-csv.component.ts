import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

import { IMyDpOptions, IMyDateModel, MyDatePicker, IMyDate } from 'mydatepicker';
import { DATE_PICKER } from 'app/admin/date-picker.settings';
import { AdminHelperService, AdminAuthService, AdminChallengesService } from 'app/admin/services';
import { GenericService } from 'app/utils/services/shared/generic.service';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-report-page',
  templateUrl: './reports-csv.component.html',
  styleUrls: ['./reports-csv.component.scss']
})
export class ReportPageAdminComponent implements OnInit {
  public myDatePickerOptionsBefore: IMyDpOptions = DATE_PICKER;
  public myDatePickerOptionsAfter: IMyDpOptions = DATE_PICKER;

  public params = {
    created_before: '',
    created_after: '',
    challenge_id: '',
    report_type: ''
  }

  public challenge = {
    q: ''
  };

  private _dateAfter;
  private _dateBefore;

  constructor(private adminHelperService: AdminHelperService,
              private adminAuthService: AdminAuthService,
              private genericService: GenericService,
              private challengeService: AdminChallengesService) { }

  public ngOnInit() {
    this.dateBefore = this.convertDate(moment());
    this.dateAfter = this.convertDate(moment().subtract(30, 'days'));
  }

  public convertDate(momentDate) {
    return {
      date: {
        year: momentDate.year(),
        month: momentDate.month(),
        day: momentDate.date()
      },
      jsdate: momentDate.toDate()
    }
  }

  public get challengeParams(): object {
    return this.adminHelperService.getParams(this.challenge);
  }

  public get getChallenges(): Observable<object> {
    return this.challengeService
               .getChallengesSearch(this.challengeParams);
  }

  public onSelectTypeahead(event: TypeaheadMatch): void {
    this.params.challenge_id = event.item.id;
  }

  public get dateAfter() {
    return this._dateAfter;
  }

  public set dateAfter(newValue) {
    if (newValue) {
      this._dateAfter = newValue;
      this.params.created_after = this.adminHelperService
                                   .formatDateToSending(newValue.jsdate);
    } else {
      this.params.created_after = '';
    }
  }

  public get dateBefore() {
    return this._dateBefore;
  }

  public set dateBefore(newValue) {
    if (newValue) {
      this._dateBefore = newValue;
      this.params.created_before = this.adminHelperService
                                   .endOfDay(newValue.jsdate);
    } else {
      this.params.created_before = ''
    }
  }

  public disableAfter(event: IMyDateModel): void {
    const copy = this.getCopyOfOptions(this.myDatePickerOptionsAfter);
    copy.disableSince = this.getDate(event, 1);
    this.myDatePickerOptionsAfter = copy;
  }

  public disableBefore(event: IMyDateModel): void {
    const copy = this.getCopyOfOptions(this.myDatePickerOptionsBefore);
    copy.disableUntil = this.getDate(event, -1);
    this.myDatePickerOptionsBefore = copy;
  }

  private getDate(event: IMyDateModel, optionDay = 0): IMyDate {
    return { year: event.date.year,
             month: event.date.month,
             day: event.date.day + optionDay }
  }

  private getCopyOfOptions(myDatePickerOptions: IMyDpOptions): IMyDpOptions {
    return JSON.parse(JSON.stringify(myDatePickerOptions));
  }

  public get accessToken(): string {
    return this.genericService.getUserData().access_token;
  }

  public canDownloadReport(): boolean {
    return !!(this.params.challenge_id
           && this.params.created_after
           && this.params.created_before
           && this.params.report_type);
  }

  public reportFileUrl(): string {
    return this.adminAuthService.getApiPath()
         + `reports/${this.params.report_type}`;
  }

  public downloadReportTitle(): string {
    if (!this.canDownloadReport()) {
      return 'To download report, select specific challenge, ' +
             'adjust date range and choose desired report type.';
    }
    return '';
  }
}
