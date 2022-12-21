import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {

  @ViewChild('successDialog') successDialog: any;
  @ViewChild('errorDialog') errorDialog: any;

  signUpError: boolean = false;

  userEmail: string = '';
  userFirstName: string = '';
  userLastName: string = '';
  userPassword: string = ''
  userConfirmPassword: string = '';
  
  userPhoneNumber: string = '';
  userReferralCode: string = '';


  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  submitSignUpForm() {
    console.log('submitSignUpForm');

    const apiUrl = '/api/auth/signup';
    let apiData = { 
      userEmail: this.userEmail.trim(),
      userFirstName: this.userFirstName.trim(),
      userLastName: this.userLastName.trim(),

      userPassword: this.userPassword.trim(),
      userConfirmPassword: this.userConfirmPassword.trim(),

      userPhoneNumber: this.userPhoneNumber.trim(),
      userReferralCode: this.userReferralCode.trim(),

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
    //location.reload();
    this.router.navigate(['/login']);
  }

  errorDialogOkClicked(dlg: any) {
    dlg.close();
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

}
