import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { IBatchData, IChallenge, IPayment } from 'app/admin/models';
import { AdminHelperService, BillComService } from 'app/admin/services';
import { InfoModalComponent } from 'app/admin/components/modals/info/info.component';

@Component({
  selector: 'app-bill-com-confirm-code',
  templateUrl: './bill-com-confirm-code.component.html',
  styleUrls: ['./bill-com-confirm-code.component.scss']
})
export class ConfirmationCodeBillComComponent implements OnInit, OnDestroy {
  public isLoad = false;
  public code = '';
  public timer = 300;
  public interval: any;

  constructor(private dialog: MdDialog,
              private _adminHelperService: AdminHelperService,
              private billComService: BillComService,
              private _dialogRef: MdDialogRef<ConfirmationCodeBillComComponent>) {}

  ngOnInit() {
    this.interval = setInterval(() => {
      if (this.checkTimer) {
        this.timer = this.timer - 1;
      } else {
        this.interval = undefined;
      }
    }, 1000)
  }

  ngOnDestroy(): void {
    this.interval = undefined;
  }

  public onSubmit(): void {
    const code = this.code.substr(0, 3) + '-' + this.code.substr(3, 3);
    this.billComService
      .confirmCode(code)
      .subscribe(
        response => {
          this._dialogRef.close(true);
        },
        error => {
          this.openInfo([error.json().message]);
        }
      )
  }

  public get checkTimer(): boolean {
    return this.timer > 0;
  }

  public get checkCode() {
    return this.code.length === 6 && this.code.match(/^-{0,1}\d+$/) && this.checkTimer;
  }

  public openInfo(content: any): void {
    this.dialog
      .open(InfoModalComponent, { data: content });
  }

}
