import { ProductRequired } from "./product.model";

export class ProductInfo {
  product!: ProductRequired;
  color!: Color;
  size!: Size;
  quantity!: number;

  constructor(productInfo: ProductInfo){
    this.product = productInfo.product;
    this.color =  productInfo.color;
    this.size = productInfo.size;
    this.quantity = productInfo.quantity;
  }
}

export class Color {
  colorId?: number;
  colorName!: string;
  colorHex!: string;

  constructor(color: Color){
    this.colorId = color.colorId;
    this.colorName = color.colorName;
    this.colorHex = color.colorHex;
  }
}

export class Size {
  sizeId?: number;
  sizeName!: string;

  constructor(size: Size){
    this.sizeId = size.sizeId;
    this.sizeName = size.sizeName;
  }
}
