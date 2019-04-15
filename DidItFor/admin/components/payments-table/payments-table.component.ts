import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MdDialog } from '@angular/material';

import { IPayment } from 'app/admin/models';
import {
  InfoAboutPaymentModalComponent
} from 'app/admin/components/modals/info-about-payment/info-about-payment.component';
import {
  ConfirmationModalComponent
} from 'app/admin/components/modals/confirmation/confirmation.component';
import { InfoModalComponent } from 'app/admin/components/modals/info/info.component';
import { AdminHelperService, AdminRefundsService } from 'app/admin/services';

@Component({
  selector: 'app-payments-table',
  templateUrl: './payments-table.component.html',
  styleUrls: ['./payments-table.component.scss']
})
export class PaymentsTableComponent {
  @Input() public payments: IPayment[];
  @Input() public reportUse: boolean;
  @Input() public sortBy: string;
  @Input() public orderBy: string;
  @Output() public changeSortBy: EventEmitter<string> = new EventEmitter();
  @Output() public updatePayments: EventEmitter<boolean> = new EventEmitter();

  public statuses = {
    refunded: 'Refunded',
    succeeded: 'Succeeded',
    failed: 'Failed',
    pending: 'Pending'
  };

  public sortFields = {
    id: 'id',
    challengeName: 'challenge_title',
    donor: 'user_name',
    donatedAt: 'created_at',
    amount: 'amount_in_cents',
    status: 'status'
  }

  public orderFields = {
    asc: 'asc',
    desc: 'desc'
  }

  constructor(private _dialog: MdDialog,
              private _adminHelperService: AdminHelperService,
              private _adminRefundsService: AdminRefundsService) { }

  public changeSort(sortBy: string): void {
    this.changeSortBy.emit(sortBy);
  }

  public isSorting(sortBy: string, orderBy: string): boolean {
    return sortBy === this.sortBy && orderBy === this.orderBy;
  }

  public get allChecked(): boolean {
    const filteredPayments = this.payments.filter(this.canCancelPayment.bind(this))
    return filteredPayments.length > 0 &&
           filteredPayments.every(payment => payment.checked);
  }

  public set allChecked(newValue: boolean) {
    this
      .payments.filter(this.canCancelPayment.bind(this))
      .forEach(payment => payment.checked = newValue)
  }

  public get checkedCheckbox(): boolean {
    const filteredPayments = this
      .payments
      .filter(this.canCancelPayment.bind(this))
    return filteredPayments.length === 0;
  }

  public openDialogInfoAboutPayment(payment: IPayment): void {
    this._dialog.open(InfoAboutPaymentModalComponent, { data: payment });
  }

  private openDialogConfirmationRefund(payment: IPayment): void {
    const text = ['Are you sure?'];

    this._dialog.open(ConfirmationModalComponent, {data: text})
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.createRefund(payment.id);
        }
      });
  }

  public createRefund(idPayment: number): void {
    this._adminRefundsService
      .createRefund(idPayment)
      .subscribe(
        response => {
          this.openInfo(['Refund was created']);
          this.updatePayments.emit();
        },
        error => {
          const json = error.json();
          this.openInfo([json.message.base]);
        }
      )
  }

  public openInfo(content: any): void {
    this._dialog
        .open(InfoModalComponent, { data: content });
  }

  public canCancelPayment(payment: IPayment): boolean {
    return payment.status === 'succeeded' && this.withinCancelPeriod(payment.created_at);
  }

  public withinCancelPeriod(date: string): boolean {
    return this._adminHelperService.withinCancelPeriod(date);
  }

  public formatDateToView(date: string): string {
    return this._adminHelperService.formatDateToView(date);
  }

  public formatCentsToDollars(cents: number): string {
    return this._adminHelperService.formatCentsToDollars(cents);
  }

}
