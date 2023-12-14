export class Category {
  categoryId?: number;
  categoryName!: string;

  constructor(category: Category){
    this.categoryId = category.categoryId;
    this.categoryName = category.categoryName;
  }
}
