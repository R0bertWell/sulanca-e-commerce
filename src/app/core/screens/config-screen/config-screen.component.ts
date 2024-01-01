import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { Config } from 'src/app/shared/models/config.model';
import { GlobalVariablesService } from 'src/app/shared/services/global/global-variables.service';
import { ConfigService } from './services/config.service';
import { LayoutConfig } from 'src/app/shared/models/layout-config.model';

export class Teste {
  'value': number;
  'desc': string;
}



@Component({
  selector: 'app-config-screen',
  templateUrl: './config-screen.component.html',
  styleUrls: ['./config-screen.component.scss']
})
export class ConfigScreenComponent {
  navbar__bgColor: string = '#000000';
  footer__bgColor: string = '#000000';
  your_logo: string = 'assets/images/dkumlook-logo.jpg';
  footer_logo: string = 'assets/images/dkumlook-logo.jpg'
  backgroundConfig: Teste[] = [{value: 1, desc: "Cor de fundo"}, {value: 2, desc: 'Imagem de Fundo'}];

  backgroundContentControl: FormControl = new FormControl(1);
  backgroundFileUrlControl: FormControl = new FormControl(1);

  content_bgColor: string = '#ffffff';
  content_bgImg: string = '';
  content_bgImg_TO_SAVE?: File | string;
  bgContentColorControl: FormControl = new FormControl(this.content_bgColor);

  config!: Config;

  whatsappControl: FormControl = new FormControl(true);
  whatsappNumberControl: FormControl = new FormControl('');

  slideBgColorControl: FormControl = new FormControl(true);


  backgroundImgControl: FormControl = new FormControl('');

  /** Configuração  **/
  /* 1° Aba */
  images: string[] = [
  'assets/images/produto-sem-imagem.png',
  'assets/images/produto-sem-imagem.png',
  'assets/images/produto-sem-imagem.png',
  'assets/images/produto-sem-imagem.png',
  'assets/images/produto-sem-imagem.png'
]

  bgFooterColorControl: FormControl = new FormControl('#000000');
  bgHeaderColorControl: FormControl = new FormControl('#000000');
  backgroundColorControl: FormControl = new FormControl('#ffffff');

  layoutConfig!: LayoutConfig;
  layoutConfig_TO_UPDATE!: LayoutConfig;

  /* 2° Aba */
  radioFluxData: any[] = [{'value': 1, desc: 'Whatsapp'}, {'value': 2, desc: 'MercadoPago'}];

  hide: boolean = true;
  apiTokenControl: FormControl = new FormControl('');

  idempotencyControl: FormControl = new FormControl('');
  hideIdemKey: boolean = true;

  configOrderFluxControl: FormControl = new FormControl();

  constructor(
    private globalService: GlobalVariablesService,
    private dialog: MatDialog,
    private configService: ConfigService
  ){
    this.backgroundContentControl.setValue(1);
    //this.content_bgImg = "url('assets/images/background-moda.jpg')";
    this.globalService.getConfig().subscribe({
      next: (response: Config)=> {
        this.config = response as Config;

        this.whatsappControl.setValue(this.config.snWhatsapp);
        this.whatsappNumberControl.setValue(this.config.whatsappNumber, {emitEvent: false});

        if(this.config.snWhatsapp){
          this.configOrderFluxControl.setValue(1, {emitEvent: false});
        } else
        if(this.config.snMercadopago){
          this.configOrderFluxControl.setValue(2, {emitEvent: false});
        }

        this.slideBgColorControl.setValue(this.config.snBgColor);
        this.backgroundColorControl.setValue(this.config.bgColor);

        /*if(this.config.snBgColor && this.config.bgColor){
          this.backgroundContentControl.setValue(1);
          this.content_bgColor = this.config.bgColor;
          this.bgContentColorControl.setValue(this.content_bgColor);
        } else
        if(this.config.snBgImg && this.config.bgImgPath){
          this.backgroundContentControl.setValue(2);
          this.content_bgImg = `url${this.config.bgImgPath})`;
        }*/
      },
      error: (error: any)=> {

      }
    })

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
    this.backgroundContentControl.valueChanges.subscribe((response: any)=> {
      console.log("Response => ", response)
      if(response === 1){
        this.content_bgImg = '';
      }
      if(response === 2){
        this.content_bgImg = `url(${this.config.bgImgPath})`;
        console.log("Content img => ", this.content_bgImg)
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

    this.whatsappControl.valueChanges.subscribe((value: any) => {
      if(value){
        this.config.snWhatsapp = value;
      }
    })

    this.whatsappNumberControl.valueChanges
    .pipe(
      distinctUntilChanged(),
      debounceTime(200)
    )
    .subscribe((whatsNumber: any)=> {
      if(whatsNumber != null){
        this.config.whatsappNumber = whatsNumber;
      }
    });

    this.configOrderFluxControl.valueChanges
    .pipe(
      debounceTime(1000)
    )
    .subscribe((value: any)=> {
      if(value === 1){
        this.config.snWhatsapp = true;
        this.config.snMercadopago = false;
      } else
      if(value === 2){
        this.config.snWhatsapp = false;
        this.config.snMercadopago = true;
      }

      this.updateConfig();
    })
  }

  loadLayoutConfig(){
    this.bgHeaderColorControl.setValue(this.layoutConfig.bgHeaderColor);
    this.bgContentColorControl.setValue(this.layoutConfig.bgColor);
    this.bgFooterColorControl.setValue(this.layoutConfig.bgFooterColor);
    this.your_logo = this.layoutConfig.headerBrand;
    this.footer_logo = this.layoutConfig.footerBrand;
  }

  resetLayoutConfig(){
    this.layoutConfig_TO_UPDATE = {...this.layoutConfig};
    this.navbar__bgColor = this.layoutConfig_TO_UPDATE.bgHeaderColor;
    this.content_bgColor = this.layoutConfig_TO_UPDATE.bgColor;
    this.footer__bgColor = this.layoutConfig_TO_UPDATE.bgFooterColor;
    this.content_bgImg = this.layoutConfig_TO_UPDATE.bgImg || '';
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

  updateConfig(){
    this.globalService.updateLayoutConfig(this.layoutConfig_TO_UPDATE).subscribe({
      next: (response: LayoutConfig)=> {
        this.layoutConfig = response as LayoutConfig;
        this.layoutConfig_TO_UPDATE = {...this.layoutConfig};
      },
      error: (error: any)=> {
        console.log("Deu erro => ", error)
      }
    })


    /*this.configService.updateConfig(this.config).subscribe({
      next: (response: Config)=> {
        this.config = response as Config;
      },
      error: (error: any)=> {
        console.log("Deu erro => ", error)
      }
    })*/
  }
}
