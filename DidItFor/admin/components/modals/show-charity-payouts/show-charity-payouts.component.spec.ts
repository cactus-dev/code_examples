import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCharityPayoutsModalComponent } from './show-charity-payouts-modal.component';

describe('ShowCharityPayoutsModalComponent', () => {
  let component: ShowCharityPayoutsModalComponent;
  let fixture: ComponentFixture<ShowCharityPayoutsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowCharityPayoutsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowCharityPayoutsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
