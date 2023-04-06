import { TestBed } from '@angular/core/testing';

import { MariageService } from './mariage.service';

describe('MariageService', () => {
  let service: MariageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MariageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
