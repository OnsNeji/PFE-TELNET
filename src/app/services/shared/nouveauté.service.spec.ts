import { TestBed } from '@angular/core/testing';

import { NouveautéService } from './nouveauté.service';

describe('NouveautéService', () => {
  let service: NouveautéService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NouveautéService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
