import { Component, OnInit } from '@angular/core';
import {
  QuickbooksIntegrationService,
  IQuickbooksIntegrationData,
  IQuickbooksIntegrationNotification,
  BillComService,
  IBillComIntegrationNotification
} from 'app/admin/services';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavAdminComponent implements OnInit {

  public quickbooksNotification: IQuickbooksIntegrationNotification;
  public billComNotification: IBillComIntegrationNotification;

  constructor(private quickbooksService: QuickbooksIntegrationService,
              private billComService: BillComService) { }

  ngOnInit() {
    this.notificationQB();
    this.notificationBillCom();
  }

  private notificationBillCom() {
    this.billComService
      .state
      .subscribe(
        notification => this.billComNotification = notification
      )
  }

  private notificationQB(): void {
    this.quickbooksService
      .state
      .subscribe(notification => this.quickbooksNotification = notification);
  }
}
