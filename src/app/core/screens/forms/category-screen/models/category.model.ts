export class Category {
  categoryId?: number;
  categoryName!: string;
  nrOrder!: number;

  constructor(category: Category){
    this.categoryId = category.categoryId;
    this.categoryName = category.categoryName;
    this.nrOrder = category.nrOrder;
  }
}

export class CategoryRequired extends Category{
  override categoryId!: number;
}
