import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMariageComponent } from './dialog-mariage.component';

describe('DialogMariageComponent', () => {
  let component: DialogMariageComponent;
  let fixture: ComponentFixture<DialogMariageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogMariageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMariageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
