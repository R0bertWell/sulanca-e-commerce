import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { RadioColorComponent } from './radio-color/radio-color.component';


export function SharedHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http , './assets/i18n/', '.json');
}

@NgModule({
  declarations: [

    ImageViewerComponent,
    ConfirmDialogComponent,
    RadioColorComponent
  ],
  imports: [
    CommonModule,

  ],
  exports:[
  ],
})
export class SharedModule { }
