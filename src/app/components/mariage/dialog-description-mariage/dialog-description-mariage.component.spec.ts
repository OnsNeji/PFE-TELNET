import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDescriptionMariageComponent } from './dialog-description-mariage.component';

describe('DialogDescriptionMariageComponent', () => {
  let component: DialogDescriptionMariageComponent;
  let fixture: ComponentFixture<DialogDescriptionMariageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDescriptionMariageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDescriptionMariageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
