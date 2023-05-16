import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReopenDemandeComponent } from './reopen-demande.component';

describe('ReopenDemandeComponent', () => {
  let component: ReopenDemandeComponent;
  let fixture: ComponentFixture<ReopenDemandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReopenDemandeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReopenDemandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
