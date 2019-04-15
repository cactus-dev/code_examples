import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceAdminComponent } from './finance-admin.component';

describe('FinanceAdminComponent', () => {
  let component: FinanceAdminComponent;
  let fixture: ComponentFixture<FinanceAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinanceAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
