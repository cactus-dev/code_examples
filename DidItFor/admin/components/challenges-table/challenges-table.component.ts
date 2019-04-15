import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MdDialog } from '@angular/material';
import { Router } from '@angular/router';

import { IChallenge, IAmountInCentsApi } from 'app/admin/models';
import { NewPayoutsModalComponent } from 'app/admin/components/modals/new-payouts/new-payouts.component';
import { InfoModalComponent } from 'app/admin/components/modals/info/info.component';

import { AdminHelperService } from 'app/admin/services';

@Component({
  selector: 'app-challenges-table',
  templateUrl: './challenges-table.component.html',
  styleUrls: ['./challenges-table.component.scss']
})
export class ChallengesTableComponent {
  @Input() public challenges: IChallenge[];
  @Input() public sortBy: string;
  @Input() public orderBy: string;
  @Output() public changeSortBy: EventEmitter<string> = new EventEmitter();
  @Output() public updateChallenges: EventEmitter<boolean> = new EventEmitter();

  public sortFields = {
    id: 'id',
    challengeName: 'title',
    totalDonation: 'total_donation_amount_in_cents',
    availableForPayout: 'available_donations_payouts_in_cents',
    lastPayoutAt: 'last_payout_at'
  }

  public orderFields = {
    asc: 'asc',
    desc: 'desc'
  }

  constructor(private _adminHelperService: AdminHelperService,
              private _dialog: MdDialog,
              private _router: Router) {}

  public get allChecked(): boolean {
    const filteredChallenges = this
      .challenges
      .filter(this.canDoPayouts)
      .filter(this.checkBankAccount);
    return filteredChallenges.length > 0 &&
           filteredChallenges.every(challenge => challenge.checked);
  }

  public set allChecked(newValue: boolean) {
    this
      .challenges
      .filter(this.checkBankAccount)
      .filter(this.canDoPayouts)
      .forEach(challenge => challenge.checked = newValue)
  }

  public get checkedCheckbox(): boolean {
    const filteredChallenges = this
      .challenges
      .filter(this.canDoPayouts)
      .filter(this.checkBankAccount);
    return filteredChallenges.length === 0;
  }

  public changeSort(sortBy: string): void {
    this.changeSortBy.emit(sortBy);
  }

  public isSorting(sortBy: string, orderBy: string): boolean {
    return sortBy === this.sortBy && orderBy === this.orderBy;
  }

  public isPayout(challenge: IChallenge): boolean {
    return challenge.last_payout_at !== null;
  }

  public showPayouts(challenge: IChallenge): void {
    this._router.navigate(['/admin/finance/payouts'], { queryParams: { challenge_id: challenge.id }});
  }

  public showInfoModal(challenge: IChallenge): void {
    this._dialog
      .open(InfoModalComponent, {
        data: [`Challenge name: ${challenge.title}`,
               `Amount: ${this.formatUserCharityTotal(challenge.payout_pending_amount_in_cents)}`]});
  }

  public showNewPayoutsModal(challenge: IChallenge): void {
    this._dialog
      .open(NewPayoutsModalComponent, { data: challenge })
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.updateChallenges.emit();
        }
      })
  }

  public formatCentsToDollars(cents: number): string {
    return this._adminHelperService.formatCentsToDollars(cents);
  }

  public formatUserCharityTotal(paid: IAmountInCentsApi): string {
    return this.formatCentsToDollars(paid.user) + '/' +
           this.formatCentsToDollars(paid.charity) + '/' +
           this.formatCentsToDollars(paid.total);
  }

  public formatDate(date: string): string {
    return this._adminHelperService.formatDateToView(date) || 'no payouts';
  }

  public canDoPayouts(challenge: IChallenge): boolean {
    return challenge.can_do_payouts.charity &&
           challenge.has_vendor_billcom_id.charity ||
           challenge.can_do_payouts.user &&
           challenge.has_vendor_billcom_id.user;
  }

  public showInfoAboutDisabledCheckBox(challenge: IChallenge): string[] {
    if (!this.canDoPayouts(challenge) && this.checkBankAccount(challenge)) {
      const info = [];
      if (!challenge.can_do_payouts.charity &&
          !challenge.can_do_payouts.user) {
        info.push('There is no way to create a payout for the user and charity');
      }
      if (!challenge.has_vendor_billcom_id.charity &&
          !challenge.has_vendor_billcom_id.user) {
        info.push('No bill.com id for user and charity');
      }
      return info;
    }
  }

  public checkBankAccount(challenge: IChallenge): boolean {
    return challenge.is_active;
  }
}
