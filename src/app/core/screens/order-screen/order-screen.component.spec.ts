import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderScreenComponent } from './order-screen.component';

describe('OrderScreenComponent', () => {
  let component: OrderScreenComponent;
  let fixture: ComponentFixture<OrderScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
