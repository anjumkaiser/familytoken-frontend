import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-referral-codes',
  templateUrl: './referral-codes.component.html',
  styleUrls: ['./referral-codes.component.scss']
})
export class ReferralCodesComponent implements OnInit {

  rows: any[] = [];

  constructor(
    private http: HttpClient,
  ) { }


  async ngOnInit() {

    const accesstoken = window.sessionStorage.getItem('ACCESS_TOKEN');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${accesstoken}`);

    const url = '/api/getUserReferrals';
    this.http.get(url, {'headers': headers}).toPromise().then((res: any) => {
      console.log(res.data)
      if (res.success) {
        this.rows.length = 0;

        for (let x of res.data) {
          let row = {
            date: x.date,
            referral_code: x.referral_code,
            status: ''
          }

          if (x.status === 0) {
            row.status = 'Unused';
          } else if (x.status === 1) {
            row.status = 'Used';
          }

          this.rows.push(row);


        }
      }
    }).catch((e: any) => {

    });
  }


}
