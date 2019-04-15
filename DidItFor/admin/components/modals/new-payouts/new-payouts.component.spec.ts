import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPayoutsModalComponent } from './new-payouts-modal.component';

describe('NewPayoutsModalComponent', () => {
  let component: NewPayoutsModalComponent;
  let fixture: ComponentFixture<NewPayoutsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPayoutsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPayoutsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
