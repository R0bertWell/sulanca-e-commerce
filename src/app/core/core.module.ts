import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { ProductListScreenComponent } from './screens/product-list-screen/product-list-screen.component';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AppRoutingModule } from '../app-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProductScreenComponent } from './screens/forms/product-screen/product-screen.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyModule } from '@ngx-formly/core'
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../app.module';
import { HttpClient } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatChipsModule} from '@angular/material/chips';
import {MatDividerModule} from '@angular/material/divider';
import { ProductDetailScreenComponent } from './screens/product-detail-screen/product-detail-screen.component';
import { CartScreenComponent } from './screens/cart-screen/cart-screen.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatGridListModule} from '@angular/material/grid-list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ProductDialogComponent } from './screens/forms/product-screen/dialogs/product-dialog/product-dialog.component';
import { MatListModule } from '@angular/material/list';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { ColorScreenComponent } from './screens/forms/color-screen/color-screen.component';
import { ColorDialogComponent } from './screens/forms/color-screen/color-dialog/color-dialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SizeScreenComponent } from './screens/forms/size-screen/size-screen.component';
import { SizeDialogComponent } from './screens/forms/size-screen/size-dialog/size-dialog.component';
import { CategoryScreenComponent } from './screens/forms/category-screen/category-screen.component';
import { CategoryDialogComponent } from './screens/forms/category-screen/category-dialog/category-dialog.component';
import { MatRadioModule } from '@angular/material/radio';
import { RadioColorComponent } from '../shared/radio-color/radio-color.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { LoginScreenComponent } from './screens/login-screen/login-screen.component';
import { DashboardScreenComponent } from './screens/dashboard-screen/dashboard-screen.component';
import { ConfigScreenComponent } from './screens/config-screen/config-screen.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PaymentScreenComponent } from './screens/payment-screen/payment-screen.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { LayoutConfigComponent } from './screens/config-screen/screens/layout-config/layout-config.component';
import { PaymentConfigComponent } from './screens/config-screen/screens/payment-config/payment-config.component';
import { GeneralConfigComponent } from './screens/config-screen/screens/general-config/general-config.component';


@NgModule({
  declarations: [
    ProductListScreenComponent,
    ProductScreenComponent,
    ProductDetailScreenComponent,
    CartScreenComponent,
    ProductDialogComponent,
    ColorScreenComponent,
    ColorDialogComponent,
    SizeScreenComponent,
    SizeDialogComponent,
    CategoryScreenComponent,
    CategoryDialogComponent,
    RadioColorComponent,
    LoginScreenComponent,
    DashboardScreenComponent,
    ConfigScreenComponent,
    PaymentScreenComponent,
    LayoutConfigComponent,
    PaymentConfigComponent,
    GeneralConfigComponent
  ],
  exports: [
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatSidenavModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatListModule,
    IvyCarouselModule,
    CartScreenComponent,
    RadioColorComponent,
    MatSlideToggleModule,
    MatExpansionModule
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    AppRoutingModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyMaterialModule,
    FormlyModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatTableModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatDividerModule,
    MatDialogModule,
    MatGridListModule,
    FlexLayoutModule,
    IvyCarouselModule,
    MatSnackBarModule,
    MatRadioModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatExpansionModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [ HttpClient ]
      }
    }),
  ]
})
export class CoreModule { }
