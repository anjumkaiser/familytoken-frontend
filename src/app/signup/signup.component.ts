import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
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

  countries: any[] = COUNTRIES;

  signUpForm = new FormGroup({});


  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
  ) {
    this.signUpForm = fb.group({
      userFirstName: new FormControl('', [Validators.required]),
      userLastName: new FormControl('', [Validators.required]),
      userName: new FormControl('', [Validators.required]),
      userAddress: new FormControl('', [Validators.required]),
      userZipCode: new FormControl('', [Validators.required]),
      userEmail: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$") ]),
      userPassword: new FormControl('', [Validators.required]),
      userConfirmPassword: new FormControl('', [Validators.required]),
      userCountry: new FormControl('', [Validators.required]),
      userPhoneNumber: new FormControl('', [Validators.required, Validators.pattern("^00[0-9]{12}")]),
      userSponsorPhoneNumber: new FormControl('', [Validators.required]),
      userNumberOfPackages: new FormControl('', [Validators.required]),
      userDepositDone: new FormControl(false, [Validators.required]),
      userTxHash: new FormControl(''),
      userDepositType: new FormControl(0),
      userDepositHashId: new FormControl(''),
      userTotalBalance: new FormControl('', [Validators.required, Validators.pattern("[0-9]{7}")]),
      userDataIsValid: new FormControl(false, [Validators.required]),
      userDataInvalidReason: new FormControl('', [Validators.required]),
    },{
      validator: ConfirmedValidator('userPassword', 'userConfirmPassword'),
    })

  }

  ngAfterViewInit() {
    //this.signUpForm.reset();
  }


  /*
  updateCountry(event: any){
    this.model.country = event.target.value;
  }
  */


  submitSignUpForm() {
    console.log('submitSignUpForm');

    const apiUrl = '/api/auth/signup';
    const apiData = this.signUpForm.value;
    this.http.post(apiUrl, apiData).toPromise().then((x: any) => {
      console.log(x);
      this.successDialog.nativeElement.showModal();

    }).catch((e: any) => {
      console.log(e);

    });
  }


  successDialogOkClicked(dlg: any) {
    dlg.close();
    location.reload();
  }


  get f() {
    return this.signUpForm.controls;
  }

  
}
