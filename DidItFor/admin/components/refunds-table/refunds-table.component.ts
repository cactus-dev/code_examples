import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MdDialog } from '@angular/material';
import { Router } from '@angular/router';

import { IRefund } from 'app/admin/models';
import { InfoModalComponent } from 'app/admin/components/modals/info/info.component';
import { NewPayoutsModalComponent } from 'app/admin/components/modals/new-payouts/new-payouts.component';
import { AdminHelperService } from 'app/admin/services';

@Component({
  selector: 'app-refunds-table',
  templateUrl: './refunds-table.component.html',
  styleUrls: ['./refunds-table.component.scss']
})
export class RefundsTableComponent {
  @Input() public refunds: IRefund[];
  @Input() public reportUse: boolean;
  @Input() public sortBy: string;
  @Input() public orderBy: string;
  @Output() public changeSortBy: EventEmitter<string> = new EventEmitter();

  public statuses = {
    succeeded: 'Succeeded',
    failed: 'Failed',
    pending: 'Pending',
    in_progress: 'In progress'
  };

  public sortFields = {
    id: 'id',
    challengeName: 'challenge_title',
    donorName: 'donor_name',
    amount: 'refund_amount_in_cents',
    createdAt: 'created_at',
    status: 'status'
  };

  public orderFields = {
    asc: 'asc',
    desc: 'desc'
  };

  constructor(private _adminHelperService: AdminHelperService,
              private _dialog: MdDialog,
              private _router: Router) { }

  public changeSort(sortBy: string): void {
    this.changeSortBy.emit(sortBy);
  }

  public isSorting(sortBy: string, orderBy: string): boolean {
    return sortBy === this.sortBy && orderBy === this.orderBy;
  }

  public showInfo(refund: IRefund): void {
    this._dialog.open(InfoModalComponent, {
      data: [
        `Challenge name: ${refund.challenge.title}`,
        `Amount: ${this.formatCentsToDollars(refund.refund_amount_in_cents)}`
      ]
    });
  }

  public formatCentsToDollars(cents: number): string {
    return this._adminHelperService.formatCentsToDollars(cents);
  }

  public formatDate(date: string): string {
    return this._adminHelperService.formatDateToView(date);
  }
}
