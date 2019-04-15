import { Component, OnInit } from '@angular/core';
import { AdminAuthService } from 'app/admin/services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderAdminComponent implements OnInit {

  constructor(private adminAuthService: AdminAuthService) { }

  public ngOnInit(): void {
  }

  public get user(): any {
    return this.adminAuthService.getUser();
  }

  public logout(): void {
    this.adminAuthService.logout();
  }

}
