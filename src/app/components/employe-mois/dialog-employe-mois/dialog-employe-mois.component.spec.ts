import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEmployeMoisComponent } from './dialog-employe-mois.component';

describe('DialogEmployeMoisComponent', () => {
  let component: DialogEmployeMoisComponent;
  let fixture: ComponentFixture<DialogEmployeMoisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEmployeMoisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEmployeMoisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
