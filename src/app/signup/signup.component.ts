import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { COUNTRIES } from '../models/countries';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  countries: any[] = COUNTRIES;

  signUpForm = new FormGroup({
    userFullName: new FormControl('', Validators.required),
    userName: new FormControl('', Validators.required),
    userAddress: new FormControl('', Validators.required),
    userEmail: new FormControl('', Validators.required),
    userPassword: new FormControl('', Validators.required),
    userConfirmPassword: new FormControl('', Validators.required),
    userCountry: new FormControl('', Validators.required),
    userPhoneNumber: new FormControl('', Validators.required),
    userSponsorPhoneNumber: new FormControl('', Validators.required),
    userNumberOfPackages: new FormControl('', Validators.required),
    userDepositDone: new FormControl(false, Validators.required),
    userTotalBalance: new FormControl('', Validators.required),
    userDataIsValid: new FormControl(false, Validators.required),
  });


  constructor(
    private http: HttpClient,
  ) {

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

    }).catch((e: any) => {
      console.log(e);

    });
  }

  
}
