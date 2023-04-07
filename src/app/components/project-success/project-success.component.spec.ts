import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSuccessComponent } from './project-success.component';

describe('ProjectSuccessComponent', () => {
  let component: ProjectSuccessComponent;
  let fixture: ComponentFixture<ProjectSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
