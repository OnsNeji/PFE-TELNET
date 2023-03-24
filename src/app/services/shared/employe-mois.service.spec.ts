import { TestBed } from '@angular/core/testing';

import { EmployeMoisService } from './employe-mois.service';

describe('EmployeMoisService', () => {
  let service: EmployeMoisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeMoisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
