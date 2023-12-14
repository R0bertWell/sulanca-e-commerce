import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-image-viewer',
  template: `
    <img class="modal-image" [src]="data.imagePath" alt="Imagem em tamanho grande">
  `,
  styles: [`
    .modal-image {
      max-width: 100vw;
      max-height: 100vh;
      margin: auto;
      display: block;
    }
  `]
})
export class ImageViewerComponent {
  constructor(
    public dialogRef: MatDialogRef<ImageViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { imagePath: string }
  ) {}
}
