import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogProjectSuccessComponent } from './dialog-project-success.component';

describe('DialogProjectSuccessComponent', () => {
  let component: DialogProjectSuccessComponent;
  let fixture: ComponentFixture<DialogProjectSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogProjectSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogProjectSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
