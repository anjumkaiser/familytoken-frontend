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

  pool1Balance: number = 0;

  bep20FamilyTokenContract: any;
  bep20FamilyTokenDecimals: any;

  familyTokenBalance: string = '0.0';
  maxFamilyNFT: number = 0;
  familyNFTPurchaseQuantity: number = 0;
  familyNftPurchasePrice: number = 24;

  withdrawalDisabled: boolean = false;

  withdrawalDialogMaximumWithdrawalAmount: number = 0;
  withdrawalDialogWithdrawalAmount: number = 0;


  referralDialogMaximumReferralAmount: number = 0;

  autoStakingDialogBalance: number = 0;

  nftMinersAmount: number = 0;


  moveBalanceDialogFromPool: number = 0;
  moveBalanceDialogToPool: number = 0;
  moveBalanceDialogMoveValue: number = 0;

  generatedReferralCode: string = '';

  @ViewChild('moveBalanceDialog') moveBalanceDialog: any;
  @ViewChild('purchaseDialog') purchaseDialog: any;
  @ViewChild('withdrawalDialog') withdrawalDialog: any;
  @ViewChild('referralDialog') referralDialog: any;
  @ViewChild('successDialog') successDialog: any;
  @ViewChild('errorDialog') errorDialog: any;


  SuccessTitle: string = '';
  SuccessMessage: string = '';

  FailureTitle: string = '';
  FailureMessage: string = '';

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
      this.maxFamilyNFT = Math.floor(Number(this.familyTokenBalance)/this.familyNftPurchasePrice);
      console.log(this.maxFamilyNFT, this.familyTokenBalance);
    } catch (e: any) {

    }

    const accesstoken = window.sessionStorage.getItem('ACCESS_TOKEN');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${accesstoken}`);

    this.http.get('/api/getUserStanding', {'headers': headers}).toPromise().then( (res: any) => {
      console.log(res);
      this.pool1Balance = res.pool1;
      this.referralDialogMaximumReferralAmount = res.pool2;
      this.autoStakingDialogBalance = res.autostaking;
      this.nftMinersAmount = res.nftMiners;
      this.withdrawalDialogMaximumWithdrawalAmount = res.withdrawalBalance;
    }).catch((e: any) => {
      console.log(e);
    });

    const todayDate = new Date();
    const todayDayOfMonth = todayDate.getDate();

    this.withdrawalDisabled = (todayDayOfMonth === 1 || todayDayOfMonth === 15 ) ? false : true;


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
      const qty = utils.parseUnits((this.familyNFTPurchaseQuantity * this.familyNftPurchasePrice).toString(), this.bep20FamilyTokenDecimals);
      console.log(qty);
      let txnResult = await this.bep20FamilyTokenContract.transfer(familyTokenWalletAddress, qty);
      console.log(txnResult);

      const accesstoken = window.sessionStorage.getItem('ACCESS_TOKEN');
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${accesstoken}`);

        try {

          const res: any = await this.http.post('/api/processPurchase', 
            {quantity: this.familyNFTPurchaseQuantity, senderWallet: this.walletAddress, txhash: txnResult.hash},
            {'headers': headers}
          ).toPromise();
          this.familyNFTPurchaseQuantity = 0;
          if (res.success) {
            this.SuccessTitle = 'Purchase successful';
            this.SuccessMessage = 'You have successsfully purchased FamilyNFT. Your daily profit will start on 9th day.';
            this.successDialog.nativeElement.showModal();
            const bep20FamilyTokenBalance = await this.bep20FamilyTokenContract['balanceOf'](this.walletAddress.split('0x')[1]);
            const bep20FamilyTokenBalanceConverted = await utils.formatUnits(bep20FamilyTokenBalance, this.bep20FamilyTokenDecimals);
            this.familyTokenBalance = bep20FamilyTokenBalanceConverted;
            this.maxFamilyNFT = Math.floor(Number(this.familyTokenBalance)/this.familyNftPurchasePrice);
            return;

          } else {
            this.FailureTitle = 'Purchase failed';
            this.FailureMessage = 'Unable to process your family NFT purchase.';
            this.errorDialog.nativeElement.showModal();

          }
      } catch (ex: any) {
        this.FailureTitle = 'Purchase failed';
        this.FailureMessage = 'Unable to process your family NFT purchase.';
        this.errorDialog.nativeElement.showModal();
      }

    } catch (ex) {

    }

  }

  maxPossibleMoveBalance: number = 0;

  moveBalanceButtonClicked() {
    this.moveBalanceDialogFromPool = 1;
    this.moveBalanceDialogToPool = 0;
    this.moveBalanceDialogMoveValue = 0;
    this.maxPossibleMoveBalance = this.pool1Balance;
    this.moveBalanceDialog.nativeElement.showModal();
  }


  moveBalanceDialogOkButtonClicked() {
    console.log(this.moveBalanceDialogFromPool, this.moveBalanceDialogToPool);
    const accesstoken = window.sessionStorage.getItem('ACCESS_TOKEN');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${accesstoken}`);

    const url = '/api/moveBalanceBetweenPools';
    this.http.post(url, { fromPool: this.moveBalanceDialogFromPool, toPool: this.moveBalanceDialogToPool, moveValue: this.moveBalanceDialogMoveValue }, {'headers': headers}).toPromise()
    .then ((res: any) => {
      window.location.reload();

    }).catch((ex: any) => {
    });
  }


  withdrawalDialogOkButtonClicked() {
    const accesstoken = window.sessionStorage.getItem('ACCESS_TOKEN');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${accesstoken}`);
    this.http.post('/api/processWithdrawal', {Amount: this.withdrawalDialogMaximumWithdrawalAmount, WalletAddress: this.walletAddress }, {'headers': headers}).toPromise().then ((res: any) => {
      this.withdrawalDialogMaximumWithdrawalAmount -= this.withdrawalDialogMaximumWithdrawalAmount;
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


  familyNftMinerPoolButtonClicked() {

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



  successDialogOkClicked(dlg: any) {
    dlg.close();
    location.reload();
  }

  errorDialogOkClicked(dlg: any) {
    dlg.close();
  }

}
