import { Injectable } from '@angular/core';
import { Observable, Observer, Subject } from 'rxjs/Rx';
import { GenericService } from '../../../utils/services/shared/generic.service';
import { AdminAuthService } from 'app/admin/services/auth/auth.service';

export interface IQuickbooksIntegrationData {
  status: string,
  activationDate: string,
  daysToExpiration: number,
  active: boolean
}

export interface IQuickbooksIntegrationNotification {
  cssClass: string,
  text: string,
}

const API_ROUTES = {
  BASE: 'integrations/quickbooks',
  ENABLE: 'integrations/quickbooks/enable',
  DISABLE: 'integrations/quickbooks/disable'
};

@Injectable()
export class QuickbooksIntegrationService {

  public state = new Subject<IQuickbooksIntegrationNotification>();

  constructor(private adminAuthService: AdminAuthService,
              private genericService: GenericService) { }

  public getInfo(): Observable<IQuickbooksIntegrationData> {
    return Observable.create((observer: Observer<IQuickbooksIntegrationData>) => {
      this.adminAuthService.get(API_ROUTES.BASE)
        .subscribe(
          response => {
            const data = response.json();
            const quickboocksData: IQuickbooksIntegrationData = {
              status: data.status,
              activationDate: data.activation_date,
              daysToExpiration: data.days_to_expiration,
              active: data.active
            }
            this.sendNotification(quickboocksData);
            observer.next(quickboocksData);
            observer.complete();
          })
    })
  }

  public enable(): void {
    const clientUrl = `${window.location.origin}/admin/finance/settings`;
    window.location.href = this.adminAuthService.getApiPath()
                         + API_ROUTES.ENABLE
                         + `?client_url=${encodeURIComponent(clientUrl)}`;
  }

  public disable(): Observable<IQuickbooksIntegrationData> {
    return Observable.create((observer: Observer<IQuickbooksIntegrationData>) => {
      this.adminAuthService.post(API_ROUTES.DISABLE, {})
        .subscribe(
          response => {
            const data = response.json();
            const quickboocksData: IQuickbooksIntegrationData = {
              status: data.status,
              activationDate: data.activation_date,
              daysToExpiration: data.days_to_expiration,
              active: data.active
            }
            this.sendNotification(quickboocksData);
            observer.next(quickboocksData);
            observer.complete();
          })
    })
  }

  private sendNotification(quickboocksData: IQuickbooksIntegrationData): void {
    let newState: IQuickbooksIntegrationNotification = { cssClass: '', text: '' };
    if (quickboocksData.active) {
      if (quickboocksData.daysToExpiration > 0 && quickboocksData.daysToExpiration <= 30) {
        newState.cssClass = 'alert-warning';
        newState.text = `${quickboocksData.daysToExpiration} days until expiring quickbooks”`;
      } else if (quickboocksData.daysToExpiration <= 0) {
        newState.cssClass = 'alert-danger';
        newState.text = 'Quickbooks token\'s expired';
      } else {
        newState = null;
      }
    } else {
      newState.cssClass = 'alert-danger';
      newState.text = 'Quickbooks isn\'t connected';
    }
    this.state.next(newState);
  }
}
