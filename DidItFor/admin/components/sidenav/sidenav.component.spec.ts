import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavAdminComponent } from './sidenav-admin.component';

describe('SidenavAdminComponent', () => {
  let component: SidenavAdminComponent;
  let fixture: ComponentFixture<SidenavAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidenavAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
