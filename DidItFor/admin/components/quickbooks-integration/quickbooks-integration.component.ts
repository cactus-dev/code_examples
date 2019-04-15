import { Component, OnInit } from '@angular/core';

import {
  QuickbooksIntegrationService,
  IQuickbooksIntegrationData
} from 'app/admin/services';

@Component({
  selector: 'app-settings-quickbooks-integration',
  templateUrl: './quickbooks-integration.component.html',
  styleUrls: ['./quickbooks-integration.component.scss']
})
export class QuickbooksIntegrationComponent implements OnInit {

  public integration: IQuickbooksIntegrationData;

  constructor(private quickbooksService: QuickbooksIntegrationService) {}

  ngOnInit() {
    this.quickbooksService
      .getInfo()
      .subscribe(data => this.integration = data);
  }

  public enable(): void {
    this.quickbooksService.enable();
  }

  public disable(): void {
    this.quickbooksService
      .disable()
      .subscribe(data => this.integration = data);
  }

  public updateToken(): void {
    this.enable();
  }
}
