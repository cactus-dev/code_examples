import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutsAdminComponent } from './payouts-admin.component';

describe('PayoutsAdminComponent', () => {
  let component: PayoutsAdminComponent;
  let fixture: ComponentFixture<PayoutsAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayoutsAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayoutsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
