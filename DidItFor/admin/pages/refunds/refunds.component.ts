import { Component, OnInit, EventEmitter } from '@angular/core';

import { IRefund, IExtra } from 'app/admin/models';
import {
  AdminRefundsService,
  AdminHelperService,
  AdminChallengesService
} from 'app/admin/services';

import { Observable } from 'rxjs/Observable';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';

const LIMIT_PER_PAGE = 5;
const QUERY_DELAY = 300;

@Component({
  selector: 'app-refunds',
  templateUrl: './refunds.component.html',
  styleUrls: ['./refunds.component.scss']
})
export class RefundsAdminComponent implements OnInit {
  public refunds: Array<IRefund>;
  public challengeNames: Observable<object>;
  public isLoad: boolean;
  public keys = Object.keys;

  public params = {
    page: 1,
    per: LIMIT_PER_PAGE,
    q: '',
    challenge_id: '',
    status: '',
    sort_by: 'id',
    sort_order: 'asc'
  };

  public challenge = {
    q: ''
  };

  public statuses = {
    succeeded: 'Succeeded',
    failed: 'Failed',
    pending: 'Pending',
    in_progress: 'In progress'
  };

  public extra: IExtra;

  public onQueryChange: EventEmitter<any> = new EventEmitter();

  constructor(private adminRefundsService: AdminRefundsService,
              private adminHelperService: AdminHelperService,
              private challengeService: AdminChallengesService) { }

  ngOnInit() {
    this.subscribeToQueryChanges();
    this.getRefunds();
  }

  public get refundParams(): object {
    return this.adminHelperService.getParams(this.params);
  }

  public get challengeParams(): object {
    return this.adminHelperService.getParams(this.challenge);
  }

  public getRefunds(): void {
    this.isLoad = true;
    this.adminRefundsService
      .getRefunds(this.refundParams)
      .subscribe(response => {
        const json = response.json();
        this.refunds = json.data.refunds;
        this.extra = json.extra;
        this.isLoad = false;
      })
  }

  public get getChallenges(): Observable<object> {
    return this.challengeService
               .getChallengesSearch(this.challengeParams);
  }

  public onSelectTypeahead(event: TypeaheadMatch): void {
    this.params.challenge_id = event.item.id;
    this.getRefunds();
  }

  public resetChallenges() {
    this.params.challenge_id = '';
    this.challenge.q = '';
    this.getRefunds();
  }

  public subscribeToQueryChanges(): void {
    this
      .onQueryChange
      .debounceTime(QUERY_DELAY)
      .subscribe(this.onFilterChanged.bind(this));
  }

  public onFilterChanged(): void {
    this.params.page = 1;
    this.getRefunds();
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
