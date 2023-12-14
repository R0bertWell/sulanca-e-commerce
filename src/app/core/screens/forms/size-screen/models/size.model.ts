export class Size {
  sizeId?: number;
  sizeName!: string;

  constructor(size: Size){
    this.sizeId = size.sizeId;
    this.sizeName = size.sizeName;
  }
}


export class SizeRequired extends Size {
  override sizeId!: number;
}
