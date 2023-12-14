import { CoreModule } from './core/core.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyModule } from '@ngx-formly/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { CustomMatPaginatorIntl } from './shared/custom-mat-paginator-int';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatSelectModule } from '@angular/material/select';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http , './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CoreModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormlyMaterialModule,
    MatSelectModule,
    FormlyModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [ HttpClient ]
      }
    }),
  ],

  exports: [
  ],
  providers: [
    HttpClient,
    {
      provide: MatPaginatorIntl, deps: [ TranslateService ],
      useFactory: (translateService: TranslateService) => new CustomMatPaginatorIntl(translateService)
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
