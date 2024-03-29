import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

declare var window: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  authError: boolean = false;

  userEmail: string = '';
  userPassword: string = '';


  constructor (
    private http: HttpClient,
    private router: Router,
  ) { }


  submitLoginForm() {

    const apiUrl = '/api/auth/login';
    const apiData = {
      userEmail: this.userEmail,
      userPassword: this.userPassword,
    };
    this.http.post(apiUrl, apiData).toPromise().then((res: any) => {
      if (!res.success) {
        this.authError = true;
        return;
      }
      window.sessionStorage.setItem('ACCESS_TOKEN', res.token);
      window.sessionStorage.setItem('USER', JSON.stringify(res.user));
      this.router.navigate(['']);

    }).catch((e: any) => {
      console.log(e);
      if (e.status === 401) {
        this.authError = true;
      }

    });

  }

}
