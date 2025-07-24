import { TestBed } from '@angular/core/testing';

import { AtaqueService } from './ataque.service';

describe('AtaqueService', () => {
  let service: AtaqueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AtaqueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});