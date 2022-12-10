import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { timer, of, fromEvent } from 'rxjs';

import { ethers, providers } from "ethers";

declare var paypal: any;

//const priceUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd';


@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.scss']
})
export class BuyComponent implements OnInit, AfterViewInit {

  minPurchaseAmountUsd: number = 15;
  maxPurchaseAmountUsd: number = 2000;

  agreeCheckValue: boolean = false;
  agreementAccepted: boolean = false;

  connected: boolean = false;
  walletAddress: string = '';
  tokenBalance: string = '0';

  tokenQuantity: number = 1;
  tokenUnitPrice: number = 85;

  billedAmount: number = 0;
  billedCurrency: string = 'USD';
  paypalFee: number = 0;
  totalFee: number = 0;

  ethereumPriceUsd: number = 0;
  gasPriceEth: string = '0';
  gasPrice: number = 0;

  ethMainnetTranFee: number = 0;
  suggestedBaseFee: number = 0;
  transctionCharges: number = 0;

  walletConnected: boolean = false;
  walletConnectedMessage = 'WALLET NOT CONNECTED';

  usdAmount: number = 0;

  private timerSource: any;
  private scrollEventsReference: any;


  ngOnInit() {
  }


  ngAfterViewInit() {
    this.updatePriceFromToken();
  }


  updatePriceFromToken() {
    this.gasPrice = Number(this.gasPriceEth) * this.ethereumPriceUsd;
    this.usdAmount = (this.tokenQuantity * this.tokenUnitPrice);
    this.paypalFee = (this.usdAmount * 4.49/100) + 0.49;
    this.billedAmount = (this.tokenQuantity * this.tokenUnitPrice) + this.paypalFee + this.ethMainnetTranFee;
    this.transctionCharges = 2 / 100 * this.billedAmount;
    this.billedAmount += this.transctionCharges;
  }


  updatePrice() {
    /*
    let ethMainNetTransactionFeeGWei = (this.suggestedBaseFee + 2.5) * 54626;
    this.ethMainnetTranFee = (ethMainNetTransactionFeeGWei/(10**9)) * this.ethereumPriceUsd;
    this.gasPrice = Number(this.gasPriceEth) * this.ethereumPriceUsd;
    this.paypalFee = (this.usdAmount * 4.49/100) + 0.49;
    if (!!this.usdAmount && this.usdAmount < 0) {
      this.usdAmount = 0;
    }
    if (!!this.usdAmount && this.usdAmount > this.maxPurchaseAmountUsd) {
      this.usdAmount = this.maxPurchaseAmountUsd;
    }
    this.billedAmount = this.usdAmount;
    this.transctionCharges = 2 / 100 * this.billedAmount;
    this.tokenQuantity = Math.max(this.usdAmount - this.paypalFee - this.ethMainnetTranFee - this.transctionCharges, 0)/ this.tokenUnitPrice;
    */
  }


}
