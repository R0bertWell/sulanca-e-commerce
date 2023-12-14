import { Category } from "../../forms/product-screen/models/category.model";
import { ProductRequired } from "../../forms/product-screen/models/product.model";

export class ProductTag {
  category!: Category;
  products: ProductRequired[] = [];
}
