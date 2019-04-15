import { Component, OnInit, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialog, MdDialogRef } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';

import { IChallenge, IBatchData } from 'app/admin/models';
import { InfoModalComponent } from 'app/admin/components/modals/info/info.component';
import { ConfirmationModalComponent } from 'app/admin/components/modals/confirmation/confirmation.component';
import { AdminHelperService, AdminPayoutsService } from 'app/admin/services';

const MIN_AMOUNT_IN_CENTS = 1000;

@Component({
  selector: 'app-new-payouts',
  templateUrl: './new-payouts.component.html',
  styleUrls: ['./new-payouts.component.scss']
})
export class NewPayoutsModalComponent implements OnInit {
  public newPayoutsForm: FormGroup;
  public sendData: IBatchData;
  public tempSendData = {
    userAmount: 0,
    charityAmount: 0
  }
  public minAmount = MIN_AMOUNT_IN_CENTS;
  public isLoad = false;

  constructor(@Inject(MD_DIALOG_DATA) public data: IChallenge,
              private _dialogRef: MdDialogRef<NewPayoutsModalComponent>,
              private _dialog: MdDialog,
              private _adminHelperService: AdminHelperService,
              private _adminPayoutsService: AdminPayoutsService) {
                console.log(data)
              }

  ngOnInit() {
    this.createForm();
    this.newPayoutsForm.valueChanges
      .subscribe(() => {
        this.checkDataForm(this.newPayoutsForm.value);
      })
  }

  public createForm(): void {
    this.newPayoutsForm = new FormGroup({
      charity: new FormGroup({
        checkbox: new FormControl({
          value: false,
          disabled: !this.canDoPayoutForCharity || !this.hasVendorForCharity
        }),
        specify: new FormControl(''),
        amount: new FormControl('')
      }),
      creator: new FormGroup({
        checkbox: new FormControl({
          value: false,
          disabled: !this.canDoPayoutForUser || !this.hasVendorForUser
        }),
        specify: new FormControl(''),
        amount: new FormControl('')
      })
    });
  }

  public onSubmit(): void {
    if (this.tempSendData.userAmount > this.data.available_for_payout_amount_in_cents.user &&
        this.canDoPayoutForUser ||
        this.tempSendData.charityAmount > this.data.available_for_payout_amount_in_cents.charity &&
        this.canDoPayoutForCharity) {
      this.openInfo(['Please, check amount']);
    } else {
      this.openDialogConfirmation();
    }
  }

  public numberToCents(number: number): number {
    return parseFloat((number * 100).toFixed());
  }

  public numberToDollars(number: number): number {
    return parseFloat((number / 100).toFixed(2));
  }

  public formatCentsToDollars(cents: number): string {
    return this._adminHelperService.formatCentsToDollars(cents);
  }

  private openDialogConfirmation(): void {
    this._dialog
      .open(ConfirmationModalComponent, {
        data: [
          'Are you sure ?',
          'This will execute bank',
          'money transfers',
          'Charity: ' + this.formatCentsToDollars(this.tempSendData.charityAmount),
          'Creator/Beneficiary: ' + this.formatCentsToDollars(this.tempSendData.userAmount)
        ]})
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.afterConfirmationSubmit();
        };
      });
  }

  private afterConfirmationSubmit(): void {
    this.isLoad = true;
    this._adminPayoutsService
      .createPayout(this.checkedObjectForRequesting)
      .subscribe(
        response => {
          this.openInfo(['Payout was created']);
          this._dialogRef.close(true);
        },
        error => {
          const json = error.json();
          this.openInfo([json.message.error]);
          this._dialogRef.close(false);
        }
      )
  }

  private get checkedObjectForRequesting(): IBatchData {
    const sendData: IBatchData = {
      challenge_id: this.data.id,
      payouts: {
        user: {
          amount_in_cents: this.tempSendData.userAmount
        },
        charity: {
          amount_in_cents: this.tempSendData.charityAmount
        }
      }
    }

    const { payouts: { user, charity } } = sendData;

    switch (true) {
      case charity.amount_in_cents === 0:
        delete sendData.payouts.charity;
        break;
      case user.amount_in_cents === 0:
        delete sendData.payouts.user;
        break;
    }

    return sendData;
  }

  private checkDataForm(formData: any): void {
    const checkAmount = (formDataObject: any): number => {
      if (!formDataObject.amount && formDataObject.specify >= this.numberToDollars(MIN_AMOUNT_IN_CENTS)) {
        return formDataObject.specify;
      } else if (formDataObject.amount) {
        return formDataObject.amount;
      } else {
        return -1;
      }
    }

    if (formData.charity.checkbox) {
      this.tempSendData.charityAmount = this.numberToCents(checkAmount(formData.charity));
    } else {
      this.tempSendData.charityAmount = 0;
    }
    if (formData.creator.checkbox) {
      this.tempSendData.userAmount = this.numberToCents(checkAmount(formData.creator));
    } else {
      this.tempSendData.userAmount = 0;
    }
  }

  public openInfo(content: any): void {
    this._dialog
        .open(InfoModalComponent, { data: content });
  }

  public get canDoPayoutForCharity(): boolean {
    return this.data.can_do_payouts.charity;
  }

  public get canDoPayoutForUser(): boolean {
    return this.data.can_do_payouts.user;
  }

  public get hasVendorForCharity(): boolean {
    return this.data.has_vendor_billcom_id.charity;
  }

  public get hasVendorForUser(): boolean {
    return this.data.has_vendor_billcom_id.user;
  }
}
