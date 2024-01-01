import { ProductInfo } from "../../forms/product-screen/models/product-info.model";

export class Cart {
  cartId?: number;
  excursion!: string;
  orderDate!: Date;
  totalValue!: number;
  payed!: boolean;
  items: ProductInfo[] = [];
}

export class RequiredCart extends Cart {
  override cartId!: number;
}

export class ProductCart {
  productCartId!: number;
  cartId!: number;
  productId!: number;
  colorId!: number;
  sizeId!: number;
  productQuantity!: number;
  totalValue!: number;
}
