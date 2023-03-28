import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConventionComponent } from './dialog-convention.component';

describe('DialogConventionComponent', () => {
  let component: DialogConventionComponent;
  let fixture: ComponentFixture<DialogConventionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogConventionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogConventionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
