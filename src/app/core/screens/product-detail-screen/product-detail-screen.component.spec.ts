import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailScreenComponent } from './product-detail-screen.component';

describe('ProductDetailScreenComponent', () => {
  let component: ProductDetailScreenComponent;
  let fixture: ComponentFixture<ProductDetailScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductDetailScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDetailScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
