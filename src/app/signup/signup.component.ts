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
      userFullName: new FormControl('', [Validators.required]),
      userName: new FormControl('', [Validators.required]),
      userAddress: new FormControl('', [Validators.required]),
      userEmail: new FormControl('', [Validators.required]),
      userPassword: new FormControl('', [Validators.required]),
      userConfirmPassword: new FormControl('', [Validators.required]),
      userCountry: new FormControl('', [Validators.required]),
      userPhoneNumber: new FormControl('', [Validators.required]),
      userSponsorPhoneNumber: new FormControl('', [Validators.required]),
      userNumberOfPackages: new FormControl('', [Validators.required]),
      userDepositDone: new FormControl(false, [Validators.required]),
      userTotalBalance: new FormControl('', [Validators.required]),
      userDataIsValid: new FormControl(false, [Validators.required]),
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
