import { Injectable } from '@angular/core';
import { AdminAuthService } from 'app/admin/services/auth/auth.service';

@Injectable()
export class AdminPayoutsService {

  constructor(private adminAuthService: AdminAuthService) {}

  getPayouts(params = {}) {
    return this
      .adminAuthService
      .get('payouts', {params: params});
  }

  createPayout(params = {}) {
    return this
      .adminAuthService
      .post('payouts', params);
  }

  batchPayouts(params = {}) {
    return this
      .adminAuthService
      .post('batch_payouts', {challenges: params});
  }

  cancelPayout(idPayout: number) {
    return this
      .adminAuthService
      .patch('cancel_payout', {payout_id: idPayout});
  }
}
