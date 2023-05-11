import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCongeComponent } from './dialog-conge.component';

describe('DialogCongeComponent', () => {
  let component: DialogCongeComponent;
  let fixture: ComponentFixture<DialogCongeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCongeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCongeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
