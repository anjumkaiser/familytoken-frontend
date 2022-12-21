import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { utils, providers, Contract } from "ethers";

import { bep20abi, bep20FamilyTokenContractAddress, familyTokenWalletAddress } from '../classes/consts';

declare var ethereum: any;
declare var window: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  provider: any;
  signer: any;
  walletAddress: string = '';

  userStanding: number = 400;

  bep20FamilyTokenContract: any;
  bep20FamilyTokenDecimals: any;

  familyTokenBalance: string = '0.0';
  maxFamilyNFT: number = 0;
  familyNFTPurchaseQuantity: number = 0;

  withdrawalDisabled: boolean = false;

  withdrawalDialogMaximumWithdrawalAmount: number = 0;
  withdrawalDialogWithdrawalAmount: number = 0;


  referralDialogMaximumReferralAmount: number = 0;

  autoStakingDialogBalance: number = 0;



  generatedReferralCode: string = '';

  @ViewChild('purchaseDialog') purchaseDialog: any;
  @ViewChild('withdrawalDialog') withdrawalDialog: any;
  @ViewChild('referralDialog') referralDialog: any;


  constructor (
    private http: HttpClient,
  ) { }


  async ngOnInit() {
    try {
      this.provider = new providers.Web3Provider((window as any).ethereum);
      await this.provider.send("eth_requestAccounts", []);
      this.signer = this.provider.getSigner();
      this.walletAddress = await this.signer.getAddress();
      console.log(this.walletAddress)
      console.log(bep20FamilyTokenContractAddress);
      this.bep20FamilyTokenContract = new Contract(bep20FamilyTokenContractAddress, bep20abi, this.signer);
      this.bep20FamilyTokenDecimals = await this.bep20FamilyTokenContract['decimals']();
      const bep20FamilyTokenBalance = await this.bep20FamilyTokenContract['balanceOf'](this.walletAddress.split('0x')[1]);
      const bep20FamilyTokenBalanceConverted = await utils.formatUnits(bep20FamilyTokenBalance, this.bep20FamilyTokenDecimals);
      this.familyTokenBalance = bep20FamilyTokenBalanceConverted;
      this.maxFamilyNFT = Math.floor(Number(this.familyTokenBalance)/24);
      console.log(this.maxFamilyNFT, this.familyTokenBalance);
    } catch (e: any) {

    }

    const accesstoken = window.sessionStorage.getItem('ACCESS_TOKEN');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${accesstoken}`);

    this.http.get('/api/getUserStanding', {'headers': headers}).toPromise().then( (res: any) => {
      console.log(res);
      this.withdrawalDialogMaximumWithdrawalAmount = res.pool1;
      this.referralDialogMaximumReferralAmount = res.pool2;
      this.autoStakingDialogBalance = res.autostaking;
    }).catch((e: any) => {
      console.log(e);
    });

    //this.withdrawalDialogMaximumWithdrawalAmount = this.userStanding / 4;
    // /this.referralDialogMaximumReferralAmount = this.userStanding / 4;
  }


  closeDialog(dlg: any) {
    dlg.close();
  }


  purchasePoolButtonClicked() {
    this.familyNFTPurchaseQuantity = 0;
    this.purchaseDialog.nativeElement.showModal();
  }


  async purchaseDialogOkButtonClicked() {
    try {
      console.log(this.bep20FamilyTokenDecimals);
      const qty = utils.parseUnits('1', this.bep20FamilyTokenDecimals);
      console.log(qty);
      let txnResult = await this.bep20FamilyTokenContract.transfer(familyTokenWalletAddress, qty);
      console.log(txnResult);

      const accesstoken = window.sessionStorage.getItem('ACCESS_TOKEN');
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${accesstoken}`);
      this.http.post('/api/processPurchase', 
        {quantity: this.familyNFTPurchaseQuantity, senderWallet: this.walletAddress, txhash: txnResult.hash},
        {'headers': headers}
      ).toPromise().then ((res: any) => {
        this.familyNFTPurchaseQuantity = 0;
      }).catch((ex: any) => {

      });

    } catch (ex) {

    }

  }


  withdrawalDialogOkButtonClicked() {
    const accesstoken = window.sessionStorage.getItem('ACCESS_TOKEN');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${accesstoken}`);
    this.http.post('/api/processWithdrawal', {Amount: this.withdrawalDialogWithdrawalAmount}, {'headers': headers}).toPromise().then ((res: any) => {
      this.withdrawalDialogMaximumWithdrawalAmount -= this.withdrawalDialogWithdrawalAmount;
    }).catch((ex: any) => {

    });
  }


  withdrawalPoolButtonClicked() {
    this.withdrawalDialogWithdrawalAmount = 0;
    this.withdrawalDialog.nativeElement.showModal();
  }


  referralPoolButtonClicked() {
    this.referralDialog.nativeElement.showModal();

  }


  autostakingPoolButtonClicked() {

    const accesstoken = window.sessionStorage.getItem('ACCESS_TOKEN');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${accesstoken}`);

    this.http.post('/api/processAutoStaking', { Amount : this.autoStakingDialogBalance}, {'headers': headers}).toPromise().then((res: any) => {

        if (res.success) {
          this.autoStakingDialogBalance -= this.autoStakingDialogBalance;
        }

      }).catch( (e: any) => {
        console.log(e);
      });

  }


  familyNftPoolButtonClicked() {

  }


  generateReferralCodeButtonClicked() {
    if ( this.referralDialogMaximumReferralAmount > 24) {
      const accesstoken = window.sessionStorage.getItem('ACCESS_TOKEN');
      const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${accesstoken}`);

      this.http.get('/api/generateReferralCode', {'headers': headers}).toPromise().then((res: any) => {

        if (res.success) {
          this.referralDialogMaximumReferralAmount -= 24;
          this.generatedReferralCode = res.referralCode;
        }

      }).catch( (e: any) => {
        console.log(e);
      });

    }
  }

}
