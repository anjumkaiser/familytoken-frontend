import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';

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

  userStanding: number = 0;

  withdrawalDisabled: boolean = false;

  withdrawalDialogMaximumWithdrawalAmount: number = 0;
  withdrawalDialogWithdrawalAmount: number = 0;

  @ViewChild('withdrawalDialog') withdrawalDialog: any;

  async ngOnInit() {
    try {
    this.provider = new providers.Web3Provider((window as any).ethereum);
    await this.provider.send("eth_requestAccounts", []);
    this.signer = this.provider.getSigner();
    this.walletAddress = await this.signer.getAddress();
    console.log(this.walletAddress)
    } catch (e: any) {

    }
  }


  closeDialog(dlg: any) {
    dlg.close();
  }


  withdrawalDialogOkButtonClicked() {

  }


  withdrawalPoolButtonClicked() {
    this.withdrawalDialog.nativeElement.showModal();
  }


  referralPoolButtonClicked() {

  }


  autostakingPoolButtonClicked() {

  }


  familyNftPoolButtonClicked() {

  }

}
