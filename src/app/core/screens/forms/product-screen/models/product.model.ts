import { Category } from "./category.model";

export class Product{
  productId?: number;
  productName!: string;
  productDesc?: string;
  productValue!: number;
  inStock!: boolean;

  categories: Category[] = []
  images: ProductImage[] = [];

  constructor(element: Product){
    this.productId = element.productId;
    this.productName = element.productName;
    this.productDesc = element.productDesc;
    this.productValue = element.productValue;
    this.inStock = element.inStock;
  }
}

export class ProductRequired extends Product{
  override productId!: number;

  override images: ProductImageRequired[] = [];

}

export class ProductImage {
  productImageId?: number;
  imagePath?: string;
  mainImage!: boolean;
}

export class ProductImageRequired extends ProductImage {
  override productImageId!: number;
}
