import { TestBed } from '@angular/core/testing';

import { ProjectSuccessService } from './project-success.service';

describe('ProjectSuccessService', () => {
  let service: ProjectSuccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectSuccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
