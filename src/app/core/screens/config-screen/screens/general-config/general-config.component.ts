import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Config } from 'src/app/shared/models/config.model';
import { GlobalVariablesService } from 'src/app/shared/services/global/global-variables.service';

@Component({
  selector: 'app-general-config',
  templateUrl: './general-config.component.html',
  styleUrls: ['./general-config.component.scss']
})
export class GeneralConfigComponent {

  config!: Config;

  whatsappControl: FormControl = new FormControl(true);
  whatsappNumberControl: FormControl = new FormControl('');

  slideBgColorControl: FormControl = new FormControl(true);


  backgroundImgControl: FormControl = new FormControl('');

  /* 2° Aba */
  radioFluxData: any[] = [{'value': 1, desc: 'Whatsapp'}, {'value': 2, desc: 'MercadoPago'}];

  hide: boolean = true;
  apiTokenControl: FormControl = new FormControl('');

  idempotencyControl: FormControl = new FormControl('');
  hideIdemKey: boolean = true;

  configOrderFluxControl: FormControl = new FormControl();

  constructor(
    private globalService: GlobalVariablesService,
    private dialog: MatDialog
  ){
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


  }

  ngOnInit(): void {

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

  updateConfig(){

    /*this.configService.updateConfig(this.config).subscribe({
      next: (response: Config)=> {
        this.config = response as Config;
      },
      error: (error: any)=> {
        console.log("Deu erro => ", error)
      }
    })*/
  }

  saveGeneralConfig() {
    this.globalService.updateConfig(this.config).subscribe({
      next: (response: Config)=> {
        this.config = response as Config;
        console.log("Salvo com sucesso!")
      },
      error: (error: any)=> {
        console.log("Deu erro => ", error)
      }
    })
  }
}
