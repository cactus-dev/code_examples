import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengesTableComponent } from './challenges-table.component';

describe('ChallengesTableComponent', () => {
  let component: ChallengesTableComponent;
  let fixture: ComponentFixture<ChallengesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChallengesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
