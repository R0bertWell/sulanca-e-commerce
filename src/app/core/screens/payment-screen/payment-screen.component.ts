import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentResponse } from './models/payment_response.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
declare var MercadoPago: any;

@Component({
  selector: 'app-payment-screen',
  templateUrl: './payment-screen.component.html',
  styleUrls: ['./payment-screen.component.scss']
})
export class PaymentScreenComponent {
  @ViewChild('copyIcon') copyIcon!: ElementRef;

  mp: any;
  qrCode!: string;
  qrCodeBase64!: string;
  qrCodeUrl!: SafeResourceUrl;

  description!: string;
  transactionAmount!: number;
  dateOfexpiration!: Date;

  constructor(private router: Router, private sanitizer: DomSanitizer){
    if(this.router.getCurrentNavigation()?.extras.state?.['payment']){
      const payment: PaymentResponse = this.router.getCurrentNavigation()?.extras.state?.['payment'];
      this.description = payment.description;
      this.transactionAmount = payment.transaction_amount;
      this.dateOfexpiration = payment.date_of_expiration;

      this.qrCode = payment.point_of_interaction.transaction_data.qr_code;
      this.qrCodeBase64 = payment.point_of_interaction.transaction_data.qr_code_base64;
      console.log("Base 64 ", this.qrCodeBase64)
      this.qrCodeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${this.qrCodeBase64}`);
    }



    /*this.loadScript('https://sdk.mercadopago.com/js/v2', () => {
      // Script has loaded, now you can use MercadoPago
      this.setupMercadoPago();
    });*/
  }

  ngOnInit(): void {
  }

  private loadScript(scriptUrl: string, callback: () => void) {
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.onload = callback;
    document.head.appendChild(script);
  }

  async getIdentificationTypes(mp: any) {
    try {
      const identificationTypes = await mp.getIdentificationTypes();
      const identificationTypeElement = document.getElementById('form-checkout__identificationType');

      this.createSelectOptions(identificationTypeElement, identificationTypes);
    } catch (e) {
      console.error('Error getting identificationTypes: ', e);
    }
  }

  createSelectOptions(elem: any, options: any, labelsAndKeys = { label: "name", value: "id" }) {
    const { label, value } = labelsAndKeys;

    elem.options.length = 0;

    const tempOptions = document.createDocumentFragment();

    options.forEach((option: any) => {
      const optValue = option[value];
      const optLabel = option[label];

      const opt = document.createElement('option');
      opt.value = optValue;
      opt.textContent = optLabel;

      tempOptions.appendChild(opt);
    });

    elem.appendChild(tempOptions);
  }

  setupMercadoPago() {
    const mp = new MercadoPago("TEST-ca4b5b89-35b5-44c0-9018-491c584df853");


    // Initialize Mercado Pago Pix payment form
    const checkout = mp.checkout({
      preference: {
        // Add your preference configuration here
        items: [
          {
            title: 'Nome do Produto',
            quantity: 1,
            currency_id: 'BRL',
            unit_price: 100
          }
        ],
        payment_methods: {
          pix: {
            // Add pix-specific configuration here
          }
        },
        payer: {
          // Add payer information here
        }
      }
    });

    this.getIdentificationTypes(mp);
  }

  submitForm() {
    // Handle the form submission and payment processing here
    // You may want to call a service to send the form data to your backend
    // and handle the MercadoPago payment processing logic on the server side
    console.log('Form submitted!');
  }

  copyToClipboard(value: string): void {
    // Verifica se o navegador suporta a API Clipboard
    if (navigator.clipboard) {
      // Usa a API Clipboard para copiar o valor
      navigator.clipboard.writeText(value)
        .then(() => {
          // Adicione aqui qualquer outra lógica que você deseja executar quando o valor é copiado
          console.log('Valor copiado para a área de transferência:', value);
        })
        .catch((err) => {
          console.error('Erro ao copiar para a área de transferência:', err);
        });
    } else {
      // Fallback para execCommand em navegadores mais antigos (não recomendado)
      const tempInput = document.createElement('input');
      tempInput.value = value;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      console.warn('navigator.clipboard não suportado, utilizando execCommand (obsoleto).');
    }
  }

  onCopyIconClick(): void {
    // Chama a função para copiar o valor
    this.copyToClipboard(this.qrCode);
    // Adicione aqui qualquer outra lógica que você deseja executar quando o valor é copiado
    console.log('Valor copiado para a área de transferência:', this.qrCode);
  }
}
