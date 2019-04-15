import { TestBed, inject } from '@angular/core/testing';

import { AdminPayoutsService } from './payouts.service';

describe('AdminPayoutsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminPayoutsService]
    });
  });

  it('should be created', inject([AdminPayoutsService], (service: AdminPayoutsService) => {
    expect(service).toBeTruthy();
  }));
});
