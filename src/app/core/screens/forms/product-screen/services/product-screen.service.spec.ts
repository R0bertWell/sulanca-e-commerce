import { TestBed } from '@angular/core/testing';

import { ProductScreenService } from './product-screen.service';

describe('ProductScreenService', () => {
  let service: ProductScreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductScreenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
