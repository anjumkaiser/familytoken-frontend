import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { NgxMaskModule, IConfig } from 'ngx-mask';
const maskConfig: Partial<IConfig> = {
  validation: true,
};


import { NavbarComponent } from './navbar/navbar.component';
import { LandingComponent } from './landing/landing.component';
import { DataCollectionComponent } from './data-collection/data-collection.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BuyComponent } from './buy/buy.component';
import { PaypalButtonsComponent } from './paypal-buttons/paypal-buttons.component';
import { ProfitListComponent } from './profit-list/profit-list.component';
import { ReferralCodesComponent } from './referral-codes/referral-codes.component';
import { RentedFamilyNFTComponent } from './rented-family-nft/rented-family-nft.component';

import { AuthenticatedGuard } from './guards/authenticated.guard';


const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'about', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'blog', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent, },
  { path: 'login', component: LoginComponent, },
  { path: 'signup', component: SignUpComponent, },
  { path: 'datacollection', component: DataCollectionComponent, },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthenticatedGuard]},
  { path: 'buy', component: BuyComponent, canActivate: [AuthenticatedGuard]},
  { path: 'profit-list', component: ProfitListComponent, canActivate: [AuthenticatedGuard]},
  { path: 'referral-codes', component: ReferralCodesComponent, canActivate: [AuthenticatedGuard]},
  { path: 'family-nfts', component: RentedFamilyNFTComponent, canActivate: [AuthenticatedGuard]},
];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxMaskModule.forRoot(maskConfig),
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
  declarations: [
    DataCollectionComponent,
    SignUpComponent,
    LoginComponent,
    DashboardComponent,
    BuyComponent,
    PaypalButtonsComponent,
    LandingComponent,
    ProfitListComponent,
    ReferralCodesComponent,
    RentedFamilyNFTComponent,
  ]
})
export class AppRoutingModule { }
