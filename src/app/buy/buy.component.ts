import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { timer, of, fromEvent } from 'rxjs';

import { ethers, providers } from "ethers";


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

  provider: any;
  signer: any;

  private timerSource: any;
  private scrollEventsReference: any;
  routerInstance: Router;

  constructor(
    private router: Router,
  ) {
    this.routerInstance = this.router;
  }


  async ngOnInit() {
    try {
    this.provider = new ethers.providers.Web3Provider((window as any).ethereum);
    await this.provider.send("eth_requestAccounts", []);
    this.signer = this.provider.getSigner();
    this.walletAddress = await this.signer.getAddress();
    this.walletConnectedMessage = 'WALLET CONNECTED';
    } catch (e: any) {

    }
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
    this.billedAmount = Math.round(this.billedAmount);
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

  paypalTransactionApproved(response: any, routerInstance: any) {
  }


  paypalTransactionDeclined(response: any, routerInstance: any) {
  }

}
