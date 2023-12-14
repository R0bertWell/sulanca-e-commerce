import { ProductInfo } from "src/app/core/screens/forms/product-screen/models/product-info.model";

export class Cart {
  productsInfos: ProductInfo[] = [];

  constructor(cart: Cart){

  }

  public push(productInfo: ProductInfo){
    this.productsInfos.push(productInfo);
  }
}
