import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import {
  Http,
  Response,
  Request,
  RequestMethod,
  RequestOptions,
  RequestOptionsArgs
} from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { GenericService } from 'app/utils/services/shared/generic.service';
import { AuthenticateService } from 'app/utils/services/auth/auth.service';
import { AuthenticationService } from 'app/utils/services/auth/authentication.service';
import { AppSettingsService } from 'app/utils/services/settings/appsettings.service';

const API_ADMIN_PATH = 'api/admin/';

@Injectable()
export class AdminAuthService implements CanActivate {

  constructor(private genericService: GenericService,
              private appSettingsService: AppSettingsService,
              private authenticateService: AuthenticateService,
              private authenticationService: AuthenticationService,
              private router: Router,
              private http: Http) { }

  public logout(): void {
    this.authenticateService.logout().subscribe(() => {
      this.genericService.removeUserData();
      this.router.navigate(['']);
    })
  }

  public getUser(): any {
    const userData = this.genericService.getUserData();
    return userData && userData.user ? userData.user : {};
  }

  public isAdmin(): boolean {
    return this.getUser().role === 'admin' ;
  }

  public canActivate(): boolean {
    if (!this.isAdmin()) {
      this.router.navigate(['']);
    }
    return this.isAdmin();
  }

  public getApiPath(): string {
    return this.appSettingsService.API_ENDPOINT + API_ADMIN_PATH;
  }

  public request(options: RequestOptionsArgs): Observable<Response> {
    let requestOptions: RequestOptions;

    requestOptions = this.genericService.getRequestOptionArgs();
    requestOptions = requestOptions.merge(options);

    const customRequest = new Request(requestOptions);
    return this.http.request(customRequest)
      .catch(error => this.genericService.handleError(error));
  }

  public mergeRequestOptionsArgs(options: RequestOptionsArgs, addOptions: RequestOptionsArgs): RequestOptionsArgs {
    const returnOptions: RequestOptionsArgs = options;
    if (options) {
      (<any>Object).assign(returnOptions, addOptions);
    }

    return returnOptions;
  }

  public get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.request(this.mergeRequestOptionsArgs({
      url: this.getApiPath() + url,
      method: RequestMethod.Get
    }, options));
  }

  public post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.request(this.mergeRequestOptionsArgs({
      url: this.getApiPath() + url,
      method: RequestMethod.Post,
      body: body
    }, options))
  }

  public put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.request(this.mergeRequestOptionsArgs({
      url: this.getApiPath() + url,
      method: RequestMethod.Put,
      body: body
    }, options))
  }

  public delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.request(this.mergeRequestOptionsArgs({
      url: this.getApiPath() + url,
      method: RequestMethod.Delete
    }, options));
  }

  public patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.request(this.mergeRequestOptionsArgs({
      url: this.getApiPath() + url,
      method: RequestMethod.Patch,
      body: body
    }, options))
  }

  public head(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.request(this.mergeRequestOptionsArgs({
      url: this.getApiPath() + url,
      method: RequestMethod.Head
    }, options));
  }

  public options(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.request(this.mergeRequestOptionsArgs({
      url: this.getApiPath() + url,
      method: RequestMethod.Options
    }, options));
  }
}
