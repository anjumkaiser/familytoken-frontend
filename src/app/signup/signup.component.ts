import { Component, ViewChild, AfterViewInit } from '@angular/core';
//import { FormGroup, FormArray, FormControl, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { COUNTRIES } from '../models/countries';

import { ConfirmedValidator } from '../validators/confirmed.validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements AfterViewInit {

  @ViewChild('successDialog') successDialog: any;
  @ViewChild('errorDialog') errorDialog: any;

  countries: any[] = COUNTRIES;

  //signUpForm = new FormGroup({});
  //userPurchasePackagesArray = new FormArray([]);

  mailformat = {'0': {pattern: new RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)} };


  userEmail: string = '';
  userName: string = '';
  userFirstName: string = '';
  userLastName: string = '';
  userAddress: string = '';
  userZipCode: string = '';
  userCountry: string = '';
  
  userPassword: string = ''
  userConfirmPassword: string = '';
  
  userPhoneNumber: string = '';
  userSponsorPhoneNumber: string = '';
  
  userTotalBalance: string = '';
  userTxHash: string = '';
  userDepositType = 0;
  userDepositDone: boolean = false;
  userDataIsValid: boolean = false;
  userDataInvalidReason: string = '';

  userPurchasePackagesArray: any[] = [];


  constructor(
    private http: HttpClient,
  ) {

    /*
    this.userPurchasePackagesArray = new FormArray([
      new FormControl('', [Validators.required, Validators.pattern("[0-31].[1-12].[0-9]{4}")]),
    ]);

    this.signUpForm = fb.group({
      userFirstName: new FormControl('', [Validators.required]),
      userLastName: new FormControl('', [Validators.required]),
      userName: new FormControl('', [Validators.required]),
      userAddress: new FormControl('', [Validators.required]),
      userZipCode: new FormControl('', [Validators.required, Validators.pattern("[0-9]{5}"), Validators.maxLength(5)]),
      userEmail: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$") ]),
      userPassword: new FormControl('', [Validators.required]),
      userConfirmPassword: new FormControl('', [Validators.required]),
      userCountry: new FormControl('', [Validators.required]),
      userPhoneNumber: new FormControl('', [Validators.required, Validators.pattern("^00[0-9]{12}")]),
      userSponsorPhoneNumber: new FormControl('', [Validators.required]),
      //userNumberOfPackages: new FormControl('', [Validators.required]),
      userDepositDone: new FormControl(false, [Validators.required]),
      userTxHash: new FormControl(''),
      userDepositType: new FormControl(0),
      userDepositHashId: new FormControl(''),
      userTotalBalance: new FormControl('', [Validators.required, Validators.pattern("[0-9]+")]),
      userDataIsValid: new FormControl(false, [Validators.required]),
      userDataInvalidReason: new FormControl(''),
      //userPurchasePackages: new FormControl('', [Validators.required, Validators.pattern("[0-31].[1-12].[0-9]{4}")]),
      //userPurchasePackages: new FormControl('', [Validators.required, Validators.pattern("[0-31].[1-12].[0-9]{4}")]),
      userPurchasePackagesArray: this.userPurchasePackagesArray,
    },{
      validator: ConfirmedValidator('userPassword', 'userConfirmPassword'),
    })
    */

  }

  ngAfterViewInit() {
    //this.signUpForm.reset();
  }


  /*
  updateCountry(event: any){
    this.model.country = event.target.value;
  }
  */

  submitDisabled = true;

  checkDisabled() {
    let res = false;

    return res;
  }


  submitSignUpForm() {
    console.log('submitSignUpForm');

    const apiUrl = '/api/auth/datacollection';
    let apiData = { 
      userEmail: this.userEmail.trim(),
      //userName: this.userName.trim(),
      userFirstName: this.userFirstName.trim(),
      userLastName: this.userLastName.trim(),
      userAddress: this.userAddress.trim(),
      userZipCode: this.userZipCode.trim(),
      userCountry: this.userCountry.trim(),

      //userPassword: this.userPassword.trim(),
      //userConfirmPassword: this.userConfirmPassword.trim(),

      userPhoneNumber: this.userPhoneNumber.trim(),
      userSponsorPhoneNumber: this.userSponsorPhoneNumber.trim(),

      userTotalBalance: this.userTotalBalance.trim(),
      userTxHash: this.userTxHash.trim(),
      userDepositType: this.userDepositType,
      userDepositDone: this.userDepositDone,
      userDataIsValid: this.userDataIsValid,
      userPurchasePackagesArray: this.userPurchasePackagesArray,

    };
    this.http.post(apiUrl, apiData).toPromise().then((x: any) => {
      console.log(x);
      if (x.success) {
        this.successDialog.nativeElement.showModal();
        return;
      }

      this.errorDialog.nativeElement.showModal();


    }).catch((e: any) => {
      console.log(e);
      this.errorDialog.nativeElement.showModal();

    });
  }


  successDialogOkClicked(dlg: any) {
    dlg.close();
    location.reload();
  }

  errorDialogOkClicked(dlg: any) {
    dlg.close();
  }



  regexCheckEmailAddress(input: any) {
    const re = new RegExp("/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/")
    let output = re.test(input);
    console.log(output);
    //return output;
  }


  keyPressEmail(event: any) {
    console.log(event.target.value);

    return this.regexCheckEmailAddress(event.target.value);
  }


  regexCheckDate(input: any): boolean {
    //const re = new RegExp("/^[1-31].[1-12].[0-9]{4}$/");
    const re = /[1-31].[1-12].[0-9]{4}/;
    console.log(input)
    let output = re.test(input);
    console.log(output);
    return output;
  }


  keyPressDate(event: any) {
    console.log(event.target.value);
    if (this.regexCheckDate(event.target.value) ) {
      event.preventDefault();
      return false;
    }
    return true;
  }
  


  keyPressNumbers(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }


  addNewPackage(){
    const item =  { purchaseDate: '', numberOfPackages: ''};
    this.userPurchasePackagesArray.push(item);
    console.log(this.userPurchasePackagesArray)
    //this.userPurchasePackagesArray.push(new FormControl('', Validators.required));
  }

  removePackage(idx: number){
    this.userPurchasePackagesArray.splice(idx, 1);
  }

  
}
