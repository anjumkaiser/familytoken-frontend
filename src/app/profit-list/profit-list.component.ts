import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-profit-list',
  templateUrl: './profit-list.component.html',
  styleUrls: ['./profit-list.component.scss']
})
export class ProfitListComponent implements OnInit {

  rows: any[] = [];


  constructor(
    private http: HttpClient,
  ) { }


  async ngOnInit() {

    const accesstoken = window.sessionStorage.getItem('ACCESS_TOKEN');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${accesstoken}`);

    const url = '/api/getUserProfits';
    this.http.get(url, {'headers': headers}).toPromise().then((res: any) => {
      console.log(res.data)
      if (res.success) {
        this.rows.length = 0;

        for (let x of res.data) {
          let row = {
            date: x.date,
            amount: x.amount,
            profitType: '',
            profitAgainst: '',
          }

          if (x.profit_type === 0) {
            row.profitType = 'Family NFT';
            row.profitAgainst = x.reference_data;
          } else if (x.profit_type === 1) {
            row.profitType = 'Referral';
            row.profitAgainst = `Referral Code ${x.reference_data.split(' ')[1]}`;
          }

          this.rows.push(row);


        }
      }
    }).catch((e: any) => {

    });
  }



}
