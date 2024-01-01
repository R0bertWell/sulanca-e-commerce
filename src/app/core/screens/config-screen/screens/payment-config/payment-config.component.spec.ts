import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentConfigComponent } from './payment-config.component';

describe('PaymentConfigComponent', () => {
  let component: PaymentConfigComponent;
  let fixture: ComponentFixture<PaymentConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
