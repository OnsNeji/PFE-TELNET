import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDescDemandeComponent } from './dialog-desc-demande.component';

describe('DialogDescDemandeComponent', () => {
  let component: DialogDescDemandeComponent;
  let fixture: ComponentFixture<DialogDescDemandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDescDemandeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDescDemandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
