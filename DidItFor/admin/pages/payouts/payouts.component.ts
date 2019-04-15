import { Component, OnInit, EventEmitter } from '@angular/core';
import { MdDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { AdminPayoutsService, AdminHelperService } from 'app/admin/services';
import { IPayout, IExtra } from 'app/admin/models';
import {
  ConfirmationModalComponent,
  InfoModalComponent
} from 'app/admin/components';

const QUERY_DELAY = 300;
const LIMIT_PER_PAGE = 5;

@Component({
  selector: 'app-payouts',
  templateUrl: './payouts.component.html',
  styleUrls: ['./payouts.component.scss']
})
export class PayoutsAdminComponent implements OnInit {
  public payouts: Array<IPayout>;
  public extra: IExtra;
  public keys = Object.keys;
  public isLoad: boolean;

  public params = {
    page: 1,
    per: LIMIT_PER_PAGE,
    q: '',
    status: '',
    payout_type: '',
    receiver_type: '',
    challenge_id: '',
    sort_by: 'id',
    sort_order: 'asc'
  };

  public statuses = {
    pending: 'Pending',
    cancelled: 'Cancelled',
    success: 'Success',
    failed: 'Failed'
  };

  public payoutTypes = {
    cheque: 'Cheque',
    bank_account: 'Bank Account'
  };

  public receiverTypes = {
    charity: 'Charity',
    user: 'User'
  };

  public onQueryChange: EventEmitter<any> = new EventEmitter();

  constructor(private adminPayoutsService: AdminPayoutsService,
              private adminHelperService: AdminHelperService,
              private route: ActivatedRoute) {}

  public ngOnInit(): void {
    if (this.route.snapshot.queryParams.challenge_id) {
      this.params.challenge_id = this.route.snapshot.queryParams.challenge_id;
    }
    this.subscribeToQueryChanges();
    this.getPayouts();
  }

  public subscribeToQueryChanges(): void {
    this
      .onQueryChange
      .debounceTime(QUERY_DELAY)
      .subscribe(this.onFilterChanged.bind(this));
  }

  public onFilterChanged(): void {
    this.params.page = 1;
    this.getPayouts();
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

  public get payoutParams(): object {
    return this.adminHelperService.getParams(this.params);
  }

  public getPayouts(): void {
    this.isLoad = true;
    this.adminPayoutsService
      .getPayouts(this.payoutParams)
      .subscribe(response => {
        const json = response.json();
        this.payouts = json.payouts;
        this.extra = json.extra;
        this.isLoad = false;
      })
  }
}
