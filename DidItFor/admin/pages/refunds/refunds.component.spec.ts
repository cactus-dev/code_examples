import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundsAdminComponent } from './refunds.component';

describe('RefundsAdminComponent', () => {
  let component: RefundsAdminComponent;
  let fixture: ComponentFixture<RefundsAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundsAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
