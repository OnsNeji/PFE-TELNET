import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDescComponent } from './dialog-desc.component';

describe('DialogDescComponent', () => {
  let component: DialogDescComponent;
  let fixture: ComponentFixture<DialogDescComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDescComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
