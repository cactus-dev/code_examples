import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPayoutsModalComponent } from './show-payouts-modal.component';

describe('ShowPayoutsModalComponent', () => {
  let component: ShowPayoutsModalComponent;
  let fixture: ComponentFixture<ShowPayoutsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowPayoutsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowPayoutsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
