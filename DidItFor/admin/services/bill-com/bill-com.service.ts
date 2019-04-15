import { Injectable } from '@angular/core';

import { AdminAuthService } from 'app/admin/services/auth/auth.service';
import { AdminHelperService } from 'app/admin/services/helper/helper.service';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';


export interface IBillComData {
  success: string,
  updatedAt: string,
}

export interface IBillComIntegrationNotification {
  cssClass: string,
  text: string,
}

@Injectable()
export class BillComService {
  public state = new Subject<IBillComIntegrationNotification>();

  constructor(private adminAuthService: AdminAuthService,
              private adminHelperService: AdminHelperService) {}

  public openSession(params = {}) {
    return this.adminAuthService
      .post('integrations/billcom/login', {params: params});
  }

  public disableSession() {
    return this.adminAuthService
      .delete('integrations/billcom/disable');
  }

  public checkSession(): Observable<IBillComData> {
    return Observable.create((observer: Observer<IBillComData>) => {
      return this.adminAuthService
        .get('integrations/billcom/enable')
        .subscribe(
          response => {
            const data = response.json();
            const billComData: IBillComData = {
              success: data.success,
              updatedAt: data.updated_at
            }
            this.sendNotification(billComData);
            observer.next(billComData);
            observer.complete();
          },
          error => {
            const data = error.json();
            const billComData: IBillComData = {
              success: data.success,
              updatedAt: null
            }
            this.sendNotification(billComData);
            observer.next(billComData);
            observer.complete();
          })
    })
  }

  private sendNotification(billComData: IBillComData): void {
    let newState: IBillComIntegrationNotification = { cssClass: '', text: '' };
    if (billComData.success) {
      const daysToExpiration = this.adminHelperService.sessionPeriod(billComData.updatedAt);
      if (daysToExpiration > 20 && daysToExpiration <= 30) {
        newState.cssClass = 'alert-warning';
        newState.text = `${daysToExpiration} days until expiring Bill.com`;
      } else if (daysToExpiration > 30) {
        newState.cssClass = 'alert-danger';
        newState.text = 'Bill.com token\'s expired';
      } else {
        newState = null;
      }
    } else {
      newState.cssClass = 'alert-danger';
      newState.text = 'Bill.com isn\'t connected';
    }
    this.state.next(newState);
  }

  public confirmCode(params = {}) {
    return this.adminAuthService
      .post('integrations/billcom/code', {params: params});
  }

}
