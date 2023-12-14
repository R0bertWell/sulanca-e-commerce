import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListScreenComponent } from './product-list-screen.component';

describe('ProductListScreenComponent', () => {
  let component: ProductListScreenComponent;
  let fixture: ComponentFixture<ProductListScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductListScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductListScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
