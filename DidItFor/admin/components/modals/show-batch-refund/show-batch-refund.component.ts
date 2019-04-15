import { Component, Inject } from '@angular/core';
import { MdDialog, MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

import { IBatchData, IChallenge, IPayment } from 'app/admin/models';
import { AdminHelperService, AdminPayoutsService, AdminRefundsService } from 'app/admin/services';
import { InfoModalComponent } from 'app/admin/components/modals/info/info.component';
import { ConfirmationModalComponent } from 'app/admin/components/modals/confirmation/confirmation.component';

@Component({
  selector: 'app-show-batch-refund',
  templateUrl: './show-batch-refund.component.html',
  styleUrls: ['./show-batch-refund.component.scss']
})
export class ShowBatchRefundComponent {
  public totalDonations = 0;
  public isLoad = false;

  constructor(@Inject(MD_DIALOG_DATA) public payments: IPayment[],
              private dialog: MdDialog,
              private _adminHelperService: AdminHelperService,
              private _adminRefundsService: AdminRefundsService,
              private _dialogRef: MdDialogRef<ShowBatchRefundComponent>) {
    this.totalDonations = payments.reduce((prev, current) => prev + current.amount_in_cents, 0);
  }

  public onSubmit(): void {
    this.dialog
      .open(ConfirmationModalComponent, {data: [
        'Are you sure ?'
      ]})
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.batchRefund();
        }
      });
  }

  public batchRefund(): void {
    this.isLoad = true;
    const availableRefunds: number[] = this.payments.map(payment => payment.id)
    this._adminRefundsService
      .batchRefunds(availableRefunds)
      .subscribe(
        response => {
          this.openInfo(['Batch refund was created']);
          this._dialogRef.close(true);
        },
        error => {
          const json = error.json();
          this.openInfo([json.message.error]);
          this._dialogRef.close(false);
        })
  }

  public openInfo(content: any): void {
    this.dialog
        .open(InfoModalComponent, { data: content });
  }

  public formatCentsToDollars(cents: number): string {
    return this._adminHelperService.formatCentsToDollars(cents);
  }

}
