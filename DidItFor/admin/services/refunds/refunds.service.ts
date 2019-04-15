import { Injectable } from '@angular/core';
import { AdminAuthService } from 'app/admin/services/auth/auth.service';

@Injectable()
export class AdminRefundsService {
  constructor(private adminAuthService: AdminAuthService) {}

  getRefunds(params = {}) {
    return this
      .adminAuthService
      .get('refunds', {params: params});
  }

  createRefund(idPayment: number) {
    return this
      .adminAuthService
      .post('refunds', {payment_id: idPayment});
  }

  batchRefunds(params: number[]) {
    return this
      .adminAuthService
      .post('batch_refunds', {payment_ids: params});
  }
}
