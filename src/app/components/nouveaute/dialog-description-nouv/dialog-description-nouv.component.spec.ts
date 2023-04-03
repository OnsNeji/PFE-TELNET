import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDescriptionNouvComponent } from './dialog-description-nouv.component';

describe('DialogDescriptionNouvComponent', () => {
  let component: DialogDescriptionNouvComponent;
  let fixture: ComponentFixture<DialogDescriptionNouvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDescriptionNouvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDescriptionNouvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
