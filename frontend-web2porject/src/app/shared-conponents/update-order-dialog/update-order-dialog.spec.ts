import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateOrderDialog } from './update-order-dialog';

describe('UpdateOrderDialog', () => {
  let component: UpdateOrderDialog;
  let fixture: ComponentFixture<UpdateOrderDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateOrderDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateOrderDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
