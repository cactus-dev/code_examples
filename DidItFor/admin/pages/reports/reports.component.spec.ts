import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsAdminComponent } from './reports.component';

describe('ReportsComponent', () => {
  let component: ReportsAdminComponent;
  let fixture: ComponentFixture<ReportsAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
