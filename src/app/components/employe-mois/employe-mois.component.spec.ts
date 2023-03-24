import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeMoisComponent } from './employe-mois.component';

describe('EmployeMoisComponent', () => {
  let component: EmployeMoisComponent;
  let fixture: ComponentFixture<EmployeMoisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeMoisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeMoisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
