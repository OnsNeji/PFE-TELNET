import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';
import { SendResetPasswordComponent } from './send-reset-password.component';

describe('ResetComponent', () => {
  let component: SendResetPasswordComponent;
  let fixture: ComponentFixture<SendResetPasswordComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SendResetPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
