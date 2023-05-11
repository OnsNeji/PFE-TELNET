import { TestBed } from '@angular/core/testing';

import { CongéService } from './congé.service';

describe('CongéService', () => {
  let service: CongéService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CongéService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
