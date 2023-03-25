import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaEventComponent } from './media-event.component';

describe('MediaEventComponent', () => {
  let component: MediaEventComponent;
  let fixture: ComponentFixture<MediaEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
