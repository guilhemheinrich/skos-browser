import { TestBed, inject } from '@angular/core/testing';

import { RequestDisplayerService } from './request-displayer.service';

describe('RequestDisplayerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequestDisplayerService]
    });
  });

  it('should be created', inject([RequestDisplayerService], (service: RequestDisplayerService) => {
    expect(service).toBeTruthy();
  }));
});
