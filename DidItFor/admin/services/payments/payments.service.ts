import { Injectable } from '@angular/core';
import { AdminAuthService } from 'app/admin/services/auth/auth.service';

@Injectable()
export class AdminPaymentsService {
  constructor(private adminAuthService: AdminAuthService) {}

  getPayments(params = {}) {
    return this
      .adminAuthService
      .get('payments', {params: params});
  }
}
