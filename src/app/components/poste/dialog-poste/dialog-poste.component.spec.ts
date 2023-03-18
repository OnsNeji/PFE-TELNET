import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPosteComponent } from './dialog-poste.component';

describe('DialogPosteComponent', () => {
  let component: DialogPosteComponent;
  let fixture: ComponentFixture<DialogPosteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPosteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPosteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
