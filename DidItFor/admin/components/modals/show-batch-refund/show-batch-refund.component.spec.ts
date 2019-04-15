import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowBatchRefundComponent } from './show-batch-refund.component';

describe('ShowBatchRefundComponent', () => {
  let component: ShowBatchRefundComponent;
  let fixture: ComponentFixture<ShowBatchRefundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowBatchRefundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowBatchRefundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
