import { Component, OnInit, EventEmitter } from '@angular/core';
import { MdDialog } from '@angular/material';

import { IChallenge, IExtra } from 'app/admin/models';
import { IMyDpOptions, IMyDate, IMyDateModel } from 'mydatepicker';
import { DATE_PICKER } from 'app/admin/date-picker.settings';

import {
  AdminChallengesService,
  AdminHelperService
} from 'app/admin/services';
import {
  ShowCharityPayoutsModalComponent,
  ShowPayoutsModalComponent,
  InfoModalComponent
} from 'app/admin/components';

const LIMIT_PER_PAGE = 5;

@Component({
  selector: 'app-challenges',
  templateUrl: './challenges.component.html',
  styleUrls: ['./challenges.component.scss']
})
export class ChallengesAdminComponent implements OnInit {
  public challenges: IChallenge[];
  public actions = ['Batch payouts for charity', 'Batch payouts for creator/beneficiary'];
  public isLoad: boolean;
  public myDatePickerOptions: IMyDpOptions = DATE_PICKER;

  public onQueryChange: EventEmitter<any> = new EventEmitter();

  public params = {
    page: 1,
    per: LIMIT_PER_PAGE,
    q: '',
    since: '',
    payout_available: <boolean> null,
    min_amount: null,
    sort_by: 'id',
    sort_order: 'asc',
  };

  public extra: IExtra;

  constructor(private adminChallengesService: AdminChallengesService,
              private adminHelperService: AdminHelperService,
              private _dialog: MdDialog) { }

  ngOnInit() {
    this.subscribeToQueryChanges();
    this.getChallenges();
  }

  public get challengesParams(): object {
    return this.adminHelperService.getParams(this.params);
  }

  public getChallenges(): void {
    this.isLoad = true;
    this.adminChallengesService
      .getChallenges(this.challengesParams)
      .subscribe(response => {
        const json = response.json().data;
        this.challenges = json.challenges;
        this.isLoad = false;
        this.extra = json.extra;
      })
  }

  public subscribeToQueryChanges(): void {
    this
      .onQueryChange
      .debounceTime(300)
      .subscribe(this.onFilterChanged.bind(this));
  }

  public onFilterChanged(): void {
    this.params.page = 1;
    this.getChallenges();
  }

  public set dateSince(choosenDate: IMyDateModel) {
    if (choosenDate) {
      this.params.since = this.adminHelperService
                                  .formatDateToSending(choosenDate.jsdate);
    } else {
      this.params.since = '';
    }
  }

  public set minAmount(dollar: number) {
    this.params.min_amount = this.adminHelperService
                                 .getCentsFromDollar(dollar);
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

  public selectAction(event): void {
    const checkedChallenges = this.challenges.filter(challenge => challenge.checked);

    if (checkedChallenges.length > 0) {
      switch (event.target.value) {
        case '0':
          this.openBatchForCharityModal(checkedChallenges);
          break;
        case '1':
          this.openBatchForCreatorModal(checkedChallenges);
          break;
      }
    } else {
      this._dialog
        .open(InfoModalComponent, { data: ['You didn`t choose challenges']});
    }
    event.target.value = 'Select action';
  }

  private openBatchForCharityModal(checkedChallenges: IChallenge[]): void {
    this._dialog.open(ShowCharityPayoutsModalComponent, { data: checkedChallenges })
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.getChallenges();
        }
      });
  }

  private openBatchForCreatorModal(checkedChallenges: IChallenge[]): void {
    this._dialog.open(ShowPayoutsModalComponent, { data: checkedChallenges })
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.getChallenges();
        }
      });
  }
}
