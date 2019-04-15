import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MdDialog } from '@angular/material';

import { IPayout } from 'app/admin/models';
import {
  ConfirmationModalComponent
} from 'app/admin/components/modals/confirmation/confirmation.component';
import { InfoModalComponent } from 'app/admin/components/modals/info/info.component';
import { AdminHelperService, AdminPayoutsService } from 'app/admin/services';

@Component({
  selector: 'app-payouts-table',
  templateUrl: './payouts-table.component.html',
  styleUrls: ['./payouts-table.component.scss']
})
export class PayoutsTableComponent {
  @Input() public payouts: IPayout[];
  @Input() public reportUse: boolean;
  @Input() public sortBy: string;
  @Input() public orderBy: string;
  @Output() public changeSortBy: EventEmitter<string> = new EventEmitter();
  @Output() public updatePayouts: EventEmitter<boolean> = new EventEmitter();

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

  public sortFields = {
    challengeName: 'challenge_title',
    payoutType: 'payout_type',
    receiverType: 'receiver_type',
    amount: 'amount_in_cents',
    status: 'status'
  }

  public orderFields = {
    asc: 'asc',
    desc: 'desc'
  }

  constructor(private _dialog: MdDialog,
              private _adminHelperService: AdminHelperService,
              private _adminPayoutsService: AdminPayoutsService) { }

  public changeSort(sortBy: string): void {
    this.changeSortBy.emit(sortBy);
  }

  public isSorting(sortBy: string, orderBy: string): boolean {
    return sortBy === this.sortBy && orderBy === this.orderBy;
  }

  public formatCentsToDollars(cents: number): string {
    return this._adminHelperService.formatCentsToDollars(cents);
  }

  public canCancelPayout(payout: IPayout): boolean {
    return payout.status === 'pending';
  }

  public onCancelPayout(payout: IPayout): void {
    this._dialog.open(ConfirmationModalComponent, {
      data: [
        'Are you sure?',
        `Challenge name: ${payout.challenge.title}`,
        `Amount: ${this.formatCentsToDollars(payout.amount_in_cents)}`
      ]
    })
    .afterClosed()
    .subscribe(userConfirmed => {
      if (userConfirmed) {
        this.cancelPayout(payout.id);
      }
    });
  }

  public cancelPayout(idPayout: number): void {
    this._adminPayoutsService
      .cancelPayout(idPayout)
      .subscribe(
        response => {
          this.openInfo(['Payout was canceled']);
          this.updatePayouts.emit();
        },
        error => {
          const json = error.json();
          this.openInfo([json.message.error]);
        }
      );
  }

  public showInfo(payout: IPayout): void {
    const data = [
      `Challenge name: ${payout.challenge.title}`,
      `Amount: ${this.formatCentsToDollars(payout.amount_in_cents)}`
    ];
    this.openInfo(data);
  }

  public openInfo(content: any): void {
    this._dialog
        .open(InfoModalComponent, { data: content });
  }

}
