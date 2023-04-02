import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNouveauteComponent } from './dialog-nouveaute.component';

describe('DialogNouveauteComponent', () => {
  let component: DialogNouveauteComponent;
  let fixture: ComponentFixture<DialogNouveauteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogNouveauteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogNouveauteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
