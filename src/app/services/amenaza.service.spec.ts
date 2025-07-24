import { TestBed } from '@angular/core/testing';

import { AmenazaService } from './amenaza.service';

describe('AmenazaService', () => {
  let service: AmenazaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmenazaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
