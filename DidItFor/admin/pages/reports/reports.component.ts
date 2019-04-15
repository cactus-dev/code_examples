import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

import {
  AdminAuthService,
  AdminPayoutsService,
  AdminPaymentsService,
  AdminRefundsService,
  AdminHelperService,
  AdminChallengesService
} from 'app/admin/services';
import { IExtra, IPayment, IRefund, IPayout } from 'app/admin/models';
import { IMyDpOptions, IMyDateModel, MyDatePicker, IMyDate } from 'mydatepicker';
import { DATE_PICKER } from 'app/admin/date-picker.settings';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { Observable } from 'rxjs/Observable';
import { GenericService } from 'app/utils/services/shared/generic.service';

const LIMIT_PER_PAGE = 5;
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsAdminComponent implements OnInit {
  public tabSelected = '';
  public payments: IPayment[];
  public refunds: IRefund[];
  public payouts: IPayout[];
  public myDatePickerOptionsBefore: IMyDpOptions = DATE_PICKER;
  public myDatePickerOptionsAfter: IMyDpOptions = DATE_PICKER;
  public isLoad: boolean;

  public params = {
    page: 1,
    per: LIMIT_PER_PAGE,
    sort_by: 'id',
    sort_order: 'asc',
    challenge_id: null,
    donated_before: '',
    created_before: '',
    donated_after: '',
    created_after: '',
  }

  public challenge = {
    q: ''
  };

  public extra: IExtra;

  private _dateAfter;
  private _dateBefore;

  constructor(private payoutsService: AdminPayoutsService,
              private paymentsService: AdminPaymentsService,
              private refundsService: AdminRefundsService,
              private challengeService: AdminChallengesService,
              private adminHelperService: AdminHelperService,
              private adminAuthService: AdminAuthService,
              private genericService: GenericService) {
}

  ngOnInit() {
    this.getPaymentsByIdChallenge();
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

  public get dateAfter() {
    return this._dateAfter;
  }

  public set dateAfter(newValue) {
    if (newValue) {
      this._dateAfter = newValue;
      this.params.donated_after = this.adminHelperService
                                   .formatDateToSending(newValue.jsdate);
      this.params.created_after = this.params.donated_after;
    } else {
      this.params.donated_after = '';
      this.params.created_after = '';
    }
  }

  public get dateBefore() {
    return this._dateBefore;
  }

  public set dateBefore(newValue) {
    if (newValue) {
      this._dateBefore = newValue;
      this.params.donated_before = this.adminHelperService
                                   .endOfDay(newValue.jsdate);
      this.params.created_before = this.params.donated_before;
    } else {
      this.params.donated_before = '';
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

  public selectChallenge(): void {
    this.params.page = 1;
    switch (this.tabSelected) {
      case 'payments':
        this.getPaymentsByIdChallenge();
        break;
      case 'payouts':
        this.getPayoutsByIdChallenge();
        break;
      case 'refunds':
        this.getRefundsByIdChallenge();
        break;
      default:
        this.tabSelected = 'payments';
        this.getPaymentsByIdChallenge();
        break;
    }
  }

  public changeSortBy(sortBy: string): void {
    if (this.params.sort_by !== sortBy) {
      this.params.sort_by = sortBy;
      this.params.sort_order = 'asc';
    } else {
      this.params.sort_order === 'desc' ? this.params.sort_order = 'asc'
                                      : this.params.sort_order = 'desc';
    }
    this.selectChallenge();
  }

  public get notEmptyParams(): object {
    return this.adminHelperService.getParams(this.params);
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
    this.selectChallenge();
  }

  public getPayoutsByIdChallenge(): void {
    this.refreshPage('payouts');
    this.payoutsService
      .getPayouts(this.notEmptyParams)
      .subscribe(response => {
        const json = response.json();
        this.payouts = json.payouts;
        this.extra = json.extra;
        this.isLoad = false;
      })
  }

  public getRefundsByIdChallenge(): void {
    this.refreshPage('refunds');
    this.refundsService
      .getRefunds(this.notEmptyParams)
      .subscribe(response => {
        const json = response.json();
        this.refunds = json.data.refunds;
        this.extra = json.extra;
        this.isLoad = false;
      })
  }

  public getPaymentsByIdChallenge(): void {
    this.refreshPage('payments');
    this.paymentsService
      .getPayments(this.notEmptyParams)
      .subscribe(response => {
        const json = response.json();
        this.payments = json.data.payment_transactions;
        this.extra = json.extra;
        this.isLoad = false;
      })
  }

  public refreshPage(pageName: string): void {
    this.isLoad = true;
    this.payments = undefined;
    this.refunds = undefined;
    this.payouts = undefined;
    if (!this.tabIsActive(pageName)) {
      this.tabSelected = pageName;
      this.params.page = 1;
      this.params.sort_by = 'id';
      this.params.sort_order = 'asc';
    }
  }

  public tabIsActive(pageName: string): boolean {
    return this.tabSelected === pageName;
  }

  public get accessToken(): string {
    return this.genericService.getUserData().access_token;
  }

  public canDownloadReport(): boolean {
    return !!(this.params.challenge_id
           && this.params.created_after
           && this.params.created_before);
  }

  public reportFileUrl(): string {
    return this.adminAuthService.getApiPath() + this.tabSelected + '/csv_report';
  }

}
