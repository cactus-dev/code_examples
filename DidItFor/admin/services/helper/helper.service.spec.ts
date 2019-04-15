import { TestBed, inject } from '@angular/core/testing';

import { AdminHelperService } from './helper.service';

describe('AdminHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminHelperService]
    });
  });

  it('should be created', inject([AdminHelperService], (service: AdminHelperService) => {
    expect(service).toBeTruthy();
  }));
});
