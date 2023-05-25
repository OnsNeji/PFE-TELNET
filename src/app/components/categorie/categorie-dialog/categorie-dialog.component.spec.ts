import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieDialogComponent } from './categorie-dialog.component';

describe('CategorieDialogComponent', () => {
  let component: CategorieDialogComponent;
  let fixture: ComponentFixture<CategorieDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategorieDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorieDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
