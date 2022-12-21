import { Component } from '@angular/core';
import { Router } from '@angular/router';

declare var window: any;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  constructor (
    private router: Router,
  ) {}

  doLogout() {
    window.sessionStorage.clear();
    this.router.navigate(['/']);
  }
}
