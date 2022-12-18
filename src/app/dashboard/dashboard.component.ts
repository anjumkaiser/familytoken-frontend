import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { utils, providers, Contract } from "ethers";

declare var ethereum: any;
declare var window: any;

const familyToken = {
  contractAddress: "0xe831F96A7a1DcE1aa2EB760b1e296c6A74CaA9d5",
  decimals: 18,
};


const bUsdToken = {
  contractAddress: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
  decimals: 18,
};

const bep20abi = [
  // Read-Only Functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address owner) view returns (uint256 balance)",
  "function decimals() view returns (uint8)",

  // Authenticated Functions
  "function transfer(address to, uint amount) returns (bool success)",

  // Events
  "event Transfer(address indexed from, address indexed to, uint amount)"
];

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

  withdrawalDisabled: boolean = false;

  withdrawalDialogMaximumWithdrawalAmount: number = 0;
  withdrawalDialogWithdrawalAmount: number = 0;


  referralDialogMaximumReferralAmount: number = 0;

  autoStakingDialogBalance: number = 0;



  generatedReferralCode: string = '';

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
    } catch (e: any) {

    }

    this.http.get('/api/getUserStanding').toPromise().then( (res: any) => {
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


  withdrawalDialogOkButtonClicked() {
    this.http.post('/api/processWithdrawal', {Amount: this.withdrawalDialogWithdrawalAmount}).toPromise().then ((res: any) => {
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

  }


  familyNftPoolButtonClicked() {

  }


  generateReferralCodeButtonClicked() {
    if ( this.referralDialogMaximumReferralAmount > 24) {

      this.http.get('/api/generateReferralCode').toPromise().then((res: any) => {

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
