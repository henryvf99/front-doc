import { TestBed } from '@angular/core/testing';

import { SumarizacionService } from './sumarizacion.service';

describe('SumarizacionService', () => {
  let service: SumarizacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SumarizacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
