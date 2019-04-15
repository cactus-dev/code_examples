import { Component, OnInit, EventEmitter } from '@angular/core';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { MdDialog } from '@angular/material';

import {
  AdminHelperService,
  AdminPaymentsService,
  AdminChallengesService } from 'app/admin/services';
import { ShowBatchRefundComponent, InfoModalComponent } from 'app/admin/components';
import { IPayment, IExtra, IChallenge } from 'app/admin/models';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { DATE_PICKER } from 'app/admin/date-picker.settings';
import { Observable } from 'rxjs/Observable';

const LIMIT_PER_PAGE = 5;
const QUERY_DELAY = 300;

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
})
export class PaymentsAdminComponent implements OnInit {
  public payments: Array<IPayment>;
  public challengeNames: Observable<object>;
  public actionList = ['Batch refunds'];
  public myDatePickerOptions: IMyDpOptions = DATE_PICKER;
  public isLoad: boolean;
  public keys = Object.keys;

  public onQueryChange: EventEmitter<any> = new EventEmitter();

  public params = {
    page: 1,
    per: LIMIT_PER_PAGE,
    sort_by: 'id',
    sort_order: 'asc',
    q: '',
    challenge_id: '',
    status: '',
    donated_after: ''
  };

  public challenge = {
    q: ''
  };

  public statuses = {
    refunded: 'Refunded',
    succeeded: 'Succeeded',
    failed: 'Failed',
    pending: 'Pending'
  };

  public extra: IExtra;

  constructor(private _dialog: MdDialog,
              private adminPaymentsService: AdminPaymentsService,
              private adminHelperService: AdminHelperService,
              private challengeService: AdminChallengesService) {}

  ngOnInit() {
    this.subscribeToQueryChanges();
    this.getPayments();
  }

  public get paymentsParams(): object {
    return this.adminHelperService.getParams(this.params);
  }

  public get challengeParams(): object {
    return this.adminHelperService.getParams(this.challenge);
  }

  public set dateSince(choosenDate: IMyDateModel) {
    if (choosenDate) {
      this.params.donated_after = this.adminHelperService
                                      .formatDateToSending(choosenDate.jsdate);
    } else {
      this.params.donated_after = '';
    }
  }

  public resetChallenges() {
    this.params.challenge_id = '';
    this.challenge.q = '';
    this.getPayments();
  }

  public get getChallenges(): Observable<object> {
    return this.challengeService
               .getChallengesSearch(this.challengeParams);
  }

  public onSelectTypeahead(event: TypeaheadMatch): void {
    this.params.challenge_id = event.item.id;
    this.getPayments();
  }

  public getPayments(): void {
    this.isLoad = true;
    this.adminPaymentsService
      .getPayments(this.paymentsParams)
      .subscribe(response => {
        const json = response.json();
        this.payments = json.data.payment_transactions;
        this.extra = json.extra;
        this.isLoad = false;
      })
  }

  public subscribeToQueryChanges(): void {
    this
      .onQueryChange
      .debounceTime(QUERY_DELAY)
      .subscribe(this.onFilterChanged.bind(this));
  }

  public onFilterChanged(): void {
    this.params.page = 1;
    this.getPayments();
  }

  public selectAction(event): void {
    const checkedPayments = this.payments.filter(challenge => {
      return challenge.checked;
    });

    if (checkedPayments.length > 0) {
      switch (event.target.value) {
        case '0':
          this.openBatchForRefundModal(checkedPayments);
          break;
      }
    } else {
      this._dialog
        .open(InfoModalComponent, { data: ['You didn`t choose payments']});
    }

    event.target.value = 'Select action';
  }

  private openBatchForRefundModal(checkedChallenges: IPayment[]): void {
    this._dialog.open(ShowBatchRefundComponent, { data: checkedChallenges })
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.getPayments();
        }
      });
  }

  public changeSortBy(sortBy: string): void {
    if (this.params.sort_by !== sortBy) {
      this.params.sort_by = sortBy;
      this.params.sort_order = 'asc';
    } else {
      this.params.sort_order === 'desc' ? this.params.sort_order = 'asc'
                                      : this.params.sort_order = 'desc';
    }
    this.onFilterChanged();
  }
}
