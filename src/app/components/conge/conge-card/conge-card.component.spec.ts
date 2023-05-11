import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CongeCardComponent } from './conge-card.component';

describe('CongeCardComponent', () => {
  let component: CongeCardComponent;
  let fixture: ComponentFixture<CongeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CongeCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CongeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
