import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuItemDetail } from './menu-item-detail';

describe('MenuItemDetail', () => {
  let component: MenuItemDetail;
  let fixture: ComponentFixture<MenuItemDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuItemDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuItemDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
