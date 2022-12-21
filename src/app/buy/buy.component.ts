import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { timer, of, fromEvent } from 'rxjs';

import { ethers, providers, Contract } from "ethers";

import { bep20abi, bep20FamilyTokenContractAddress } from '../classes/consts';

declare var ethereum: any;

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

  walletAddress: string = '';
  tokenBalance: string = '0'

  minTokenQuantity: number = 24;
  maxTokenQuantity: number = 2000;

  tokenQuantity: number = 24;
  tokenUnitPrice: number = 1;

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
      this.walletConnected = true;
      this.walletConnectedMessage = 'WALLET CONNECTED';

      console.log(this.walletAddress.split('0x')[1]);

      const bep20FamilyToken = new ethers.Contract(bep20FamilyTokenContractAddress, bep20abi, this.provider);
      const bep20FamilyTokenDecimals = await bep20FamilyToken['decimals']();
      const bep20FamilyTokenBalance = await bep20FamilyToken['balanceOf'](this.walletAddress.split('0x')[1]);
      const bep20FamilyTokenBalanceConverted = await ethers.utils.formatUnits(bep20FamilyTokenBalance, bep20FamilyTokenDecimals);
      this.tokenBalance = bep20FamilyTokenBalanceConverted;
      console.log(this.tokenBalance);

      if (this.tokenBalance === '0.0') {
        const wasAdded = await ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20', // Initially only supports ERC20, but eventually more!
            options: {
              address: bep20FamilyTokenContractAddress, // The address that the token is at.
              symbol: 'FT', // A ticker symbol or shorthand, up to 5 chars.
              decimals: bep20FamilyTokenDecimals, // The number of decimals in the token
              //image: tokenImage, // A string url of the token logo
            },
          },
        })

        if(wasAdded) {
          console.log('succesfully added');
        }
      }
    } catch (e: any) {
      console.log(e);
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
