import { TestBed } from '@angular/core/testing';

import { RestaurantMenu } from './menu';

describe('Menu', () => {
  let service: RestaurantMenu;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestaurantMenu);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
