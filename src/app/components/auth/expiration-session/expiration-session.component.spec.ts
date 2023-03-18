import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { ExpirationSessionComponent } from './expiration-session.component';

describe('ExpirationSessionComponent', () => {
  let component: ExpirationSessionComponent;
  let fixture: ComponentFixture<ExpirationSessionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpirationSessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpirationSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
