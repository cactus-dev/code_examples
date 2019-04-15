import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';

import { BillComService, IBillComData } from 'app/admin/services';
import { BillComLoginComponent } from 'app/admin/components/modals/bill-com-login/bill-com-login.component';
import { InfoModalComponent } from 'app/admin/components/modals/info/info.component';

@Component({
  selector: 'app-settings-bill-com',
  templateUrl: './bill-com.component.html',
  styleUrls: ['./bill-com.component.scss']
})
export class BillComComponent implements OnInit {
  public infoBillCom: IBillComData;
  public isLoad = false;

  constructor(private billComService: BillComService,
              private dialog: MdDialog) {}

  ngOnInit() {
    this.checkStatus();
  }

  public openFormLogin(): void {
    this.dialog
      .open(BillComLoginComponent)
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.checkStatus();
        };
      })
  }

  public disableSession(): void {
    this.isLoad = true;
    this.billComService
      .disableSession()
      .subscribe(
        response => {
          this.isLoad = false;
          this.checkStatus();
        },
        error => {
          this.isLoad = false;
          this.openInfo(error.json().message);
          this.checkStatus();
        }
      )
  }

  checkStatus() {
    this.isLoad = true;
    this.billComService
      .checkSession()
      .subscribe(
        response => {
          this.infoBillCom = response;
          this.isLoad = false;
        },
        error => {}
      );
  }

  public openInfo(content: any): void {
    this.dialog
      .open(InfoModalComponent, { data: content });
  }
}
