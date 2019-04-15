import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundsTableComponent } from './refunds-table.component';

describe('RefundsTableComponent', () => {
  let component: RefundsTableComponent;
  let fixture: ComponentFixture<RefundsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
