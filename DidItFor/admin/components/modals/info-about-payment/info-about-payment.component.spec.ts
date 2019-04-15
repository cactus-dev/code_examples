import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoAboutPaymentModalComponent } from './info-about-payment-modal.component';

describe('InfoAboutPaymentModalComponent', () => {
  let component: InfoAboutPaymentModalComponent;
  let fixture: ComponentFixture<InfoAboutPaymentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoAboutPaymentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoAboutPaymentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
