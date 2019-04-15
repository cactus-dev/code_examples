import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialog, MdDialogRef } from '@angular/material';

import { InfoModalComponent } from 'app/admin/components/modals/info/info.component';
import { ConfirmationModalComponent } from 'app/admin/components/modals/confirmation/confirmation.component';
import { IChallenge, IBatchData } from 'app/admin/models';
import { AdminHelperService, AdminPayoutsService } from 'app/admin/services';

@Component({
  selector: 'app-show-payouts',
  templateUrl: './show-payouts.component.html',
  styleUrls: ['./show-payouts.component.scss']
})
export class ShowPayoutsModalComponent {
  public checkCreator = false;
  public totalDonations = 0;
  public isLoad = false;

  constructor(@Inject(MD_DIALOG_DATA) public data: IChallenge[],
              private dialog: MdDialog,
              private _adminHelperService: AdminHelperService,
              private _adminPayoutsService: AdminPayoutsService,
              private _dialogRef: MdDialogRef<ShowPayoutsModalComponent>) {
    this.totalDonations = data.filter(this.canDoPayouts)
                              .reduce((prev, current) => prev + current.available_for_payout_amount_in_cents.user, 0);
  }

  public onSubmit(): void {
    this.dialog
      .open(ConfirmationModalComponent, {data: [
        'Are you sure ?',
        'This will execute bank',
        'money transfers'
      ]})
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.batchPayoutForCreator();
        }
      });
  }

  public batchPayoutForCreator(): void {
    const availablePayouts: IBatchData[] = this
      .data
      .filter(this.canDoPayouts)
      .map(challenge => {
        return {
          challenge_id: challenge.id,
          payouts: {
            user: {
              amount_in_cents: challenge.available_for_payout_amount_in_cents.user
            }
          }
        }
      });
    if (availablePayouts.length > 0) {
      this.isLoad = true;
      this._adminPayoutsService
        .batchPayouts(availablePayouts)
        .subscribe(
          response => {
            this.openInfo(['Payout was created']);
            this._dialogRef.close(true);
          },
          error => {
            const json = error.json();
            this.openInfo([json.message.error]);
            this._dialogRef.close(false);
          })
    } else {
      this.openInfo(['Your total amount 0', 'Please select other challenges']);
    }
  }

  public openInfo(content: any): void {
    this.dialog
        .open(InfoModalComponent, { data: content });
  }

  public canDoPayouts(challenge: IChallenge): boolean {
    return challenge.can_do_payouts.user && challenge.has_vendor_billcom_id.user;
  }

  public formatCentsToDollars(cents: number): string {
    return this._adminHelperService.formatCentsToDollars(cents);
  }
}
