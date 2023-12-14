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

export class ColorRequired extends Color {
  override colorId!: number;
}
