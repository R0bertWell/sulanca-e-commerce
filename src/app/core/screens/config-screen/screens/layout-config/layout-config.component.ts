import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { Config } from 'src/app/shared/models/config.model';
import { GlobalVariablesService } from 'src/app/shared/services/global/global-variables.service';
import { LayoutConfig } from 'src/app/shared/models/layout-config.model';
import { ConfigService } from '../../services/config.service';

export class Teste {
  'value': number;
  'desc': string;
}

@Component({
  selector: 'app-layout-config',
  templateUrl: './layout-config.component.html',
  styleUrls: ['./layout-config.component.scss']
})
export class LayoutConfigComponent {
  navbar__bgColor: string = '#000000';
  footer__bgColor: string = '#000000';
  your_logo: string = 'assets/images/dkumlook-logo.jpg';
  footer_logo: string = 'assets/images/dkumlook-logo.jpg'
  backgroundConfig: Teste[] = [{value: 1, desc: "Cor de fundo"}, {value: 2, desc: 'Imagem de Fundo'}];

  backgroundContentControl: FormControl = new FormControl(1);
  backgroundFileUrlControl: FormControl = new FormControl(1);

  content_bgColor: string = '#ffffff';
  content_bgImg: string = '';
  default_contentBgImg = `url('assets/images/background-moda.jpg')`;
  content_bgImg_TO_SAVE?: File | string;
  bgContentColorControl: FormControl = new FormControl(this.content_bgColor);

  /** Configuração  **/
  /* 1° Aba */
  images: string[] = [
  'assets/images/produto-sem-imagem.png',
  'assets/images/produto-sem-imagem.png',
  'assets/images/produto-sem-imagem.png'
]

  bgFooterColorControl: FormControl = new FormControl('#000000');
  bgHeaderColorControl: FormControl = new FormControl('#000000');
  backgroundColorControl: FormControl = new FormControl('#ffffff');

  layoutConfig!: LayoutConfig;
  layoutConfig_TO_UPDATE!: LayoutConfig;

  constructor(
    private globalService: GlobalVariablesService,
    private dialog: MatDialog,
  ){
    //this.content_bgImg = "url('assets/images/background-moda.jpg')";

    this.globalService.getLayoutConfig().subscribe({
      next: (response: LayoutConfig)=> {
        this.layoutConfig = response as LayoutConfig;
        this.layoutConfig_TO_UPDATE = {...response};
        console.log("Layout Config => ", this.layoutConfig)
        this.loadLayoutConfig();
      },
      error: (error: string)=> {
        console.log("ERROR => ", error);
      }
    })
  }

  ngOnInit(): void {
    this.backgroundContentControl.valueChanges.subscribe((value: any)=> {
      console.log("Response => ", value)
      if(value != null){
        this.layoutConfig_TO_UPDATE.snBgColor = value == 1 ? true : false;
        console.log("bg img => ", this.content_bgImg)
        console.log("True false? => ", this.layoutConfig_TO_UPDATE.snBgColor)
      }
    });

    this.bgContentColorControl.valueChanges.subscribe((value: any)=> {
      console.log("Color => ", value)
      if(value){
        this.content_bgColor = value;
        this.layoutConfig_TO_UPDATE.bgColor = this.content_bgColor;
      }
    })

    this.bgHeaderColorControl.valueChanges.subscribe((value:any) => {
      if(value){
        this.navbar__bgColor = value;
        this.layoutConfig_TO_UPDATE.bgHeaderColor = this.navbar__bgColor;
      }
    })

    this.bgFooterColorControl.valueChanges.subscribe((value:any) => {
      if(value){
        this.footer__bgColor = value;
        this.layoutConfig_TO_UPDATE.bgFooterColor = this.footer__bgColor;
      }
    })

  }

  loadLayoutConfig(){
    this.bgHeaderColorControl.setValue(this.layoutConfig.bgHeaderColor);
    this.bgContentColorControl.setValue(this.layoutConfig.bgColor);
    this.bgFooterColorControl.setValue(this.layoutConfig.bgFooterColor);
    this.content_bgImg = this.layoutConfig.bgImg || this.default_contentBgImg;
    console.log("Load layout => ", this.content_bgImg)
    this.backgroundContentControl.setValue(this.layoutConfig.snBgColor ? 1 : 2);
    this.your_logo = this.layoutConfig.headerBrand;
    this.footer_logo = this.layoutConfig.footerBrand;
  }

  resetLayoutConfig(){
    this.layoutConfig_TO_UPDATE = {...this.layoutConfig};
    this.navbar__bgColor = this.layoutConfig_TO_UPDATE.bgHeaderColor;
    this.content_bgColor = this.layoutConfig_TO_UPDATE.bgColor;
    this.footer__bgColor = this.layoutConfig_TO_UPDATE.bgFooterColor;
    this.content_bgImg = this.layoutConfig_TO_UPDATE.bgImg || this.default_contentBgImg;
    this.your_logo = this.layoutConfig_TO_UPDATE.headerBrand;
    this.footer_logo = this.layoutConfig_TO_UPDATE.footerBrand;

    this.bgHeaderColorControl.setValue(this.navbar__bgColor);
    this.bgContentColorControl.setValue(this.content_bgColor);
    this.bgFooterColorControl.setValue(this.footer__bgColor);
  }

  changeHeaderLogo(event: any) {
    const input = event.target;
    if(input.files && input.files[0]){
      let dialog = this.dialog.open(ConfirmDialogComponent, {
        data: {
          message: "Tem certeza que deseja alterar a logo?"
        }
      })

      dialog.afterClosed().subscribe(result => {
        if(result){
          const file = input.files[0];
          const reader = new FileReader();
          reader.onload = (e: any)=> {
            this.your_logo = e.target.result;
          }

          reader.readAsDataURL(file);
        }
      })
    }
  }

  setBgContainerImage(event: any){
    const input = event.target;

    if(input.files && input.files[0]){
      let dialog = this.dialog.open(ConfirmDialogComponent, {
        data: {
          message: "Tem certeza que deseja alterar a imagem de fundo?"
        }
      })

      dialog.afterClosed().subscribe(result => {
        if(result){
          const file = input.files[0];
          const reader = new FileReader();
          reader.onload = (e: any)=> {
            this.content_bgImg = `url(${e.target.result})`;
          }
          reader.readAsDataURL(file);
        }
      })

    }
  }

  updateLayoutConfig(){
    this.globalService.updateLayoutConfig(this.layoutConfig_TO_UPDATE).subscribe({
      next: (response: LayoutConfig)=> {
        this.layoutConfig = response as LayoutConfig;
        this.layoutConfig_TO_UPDATE = {...this.layoutConfig};
      },
      error: (error: any)=> {
        console.log("Deu erro => ", error)
      }
    })
  }
}
