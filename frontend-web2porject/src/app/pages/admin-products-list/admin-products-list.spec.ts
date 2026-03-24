import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductsList } from './admin-products-list';

describe('AdminProductsList', () => {
  let component: AdminProductsList;
  let fixture: ComponentFixture<AdminProductsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProductsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProductsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
