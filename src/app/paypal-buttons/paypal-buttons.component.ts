import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadScript } from '@paypal/paypal-js';

declare var paypal: any;

@Component({
  selector: 'app-paypal-buttons',
  templateUrl: './paypal-buttons.component.html',
  styleUrls: ['./paypal-buttons.component.scss']
})
export class PaypalButtonsComponent implements OnInit {

  @ViewChild('paypal', { static: true}) paypalElement: any;

  @Input() walletAddress: string = '';
  @Input() tokenQuantity: number = 0;
  @Input() billedAmount: number = 0;
  @Input() billedCurrency: string = 'USD';
  @Input() router: any;

  @Input() approved?: (args?: any, arg2?: any) => void;
  @Input() declined?: (args?: any, arg2?: any) => void;

  constructor(
    private http: HttpClient,
  ) { }

  async ngOnInit() {

    try {
      let paypalClientId = JSON.parse(JSON.stringify(await this.http.get('/api/getPaypalClientId').toPromise())).paypalClientId;

      paypal = await loadScript({ 'client-id': paypalClientId});

    } catch (e) {
      console.log(e)
      return;
    }

    // PayPal buttons styling: https://developer.paypal.com/docs/checkout/standard/customize/buttons-style-guide
    
    let FUNDING_SOURCES = [
      paypal.FUNDING.PAYPAL,
      paypal.FUNDING.CARD
    ];

    let instance = this;

    FUNDING_SOURCES.forEach(function(fundingSource) {
      paypal
        .Buttons({
          fundingSource: fundingSource,
          createOrder: (data: any, actions: any ) => {
            return actions.order.create({
              purchase_units: [
              {
                description: 'Nexum Token',
                amount: {
                  currency_code: instance.billedCurrency,
                  value: instance.billedAmount,
                }
              }]
            });
          },
          onApprove: async (data: any, actions: any) => {
            const order = await actions.order.capture();
            console.log(order);

            const apiUrl: string = '/api/processPaypalTokenPurchase';
            instance.http.post(apiUrl, {order: order, walletAddress: instance.walletAddress,  tokenQuantity: instance.tokenQuantity, billedAmount: instance.billedAmount, billedCurrency: instance.billedCurrency}).toPromise()
              .then( (d: any) => {
                instance.approved?.(d, instance.router);
              })
              .catch((e: any) => {
                instance.declined?.(e, instance.router);
              });
          },
          onError: (err: any) => {
            console.log(err);
          }
        })
        .render(instance.paypalElement.nativeElement);
    });
  }

}
