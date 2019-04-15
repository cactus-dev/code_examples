import { Injectable } from '@angular/core';
import { AdminAuthService } from 'app/admin/services/auth/auth.service';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class AdminChallengesService {
  constructor(private adminAuthService: AdminAuthService) {}

  getChallenges(params = {}) {
    return this
      .adminAuthService
      .get('challenges', {params: params});
  }

  getChallengesSearch(params = {}): Observable<object> {
    return Observable.create((observer: Observer<object>) => {
      this.adminAuthService
          .get('challenges/search', {params: params})
          .subscribe(
            challenge => {
              const json = challenge.json();
              observer.next(json.data.challenges);
            },
            error => observer.error(error));
        });
  }

}
