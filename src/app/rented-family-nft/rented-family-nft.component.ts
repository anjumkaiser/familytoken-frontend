import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-rented-family-nft',
  templateUrl: './rented-family-nft.component.html',
  styleUrls: ['./rented-family-nft.component.scss']
})
export class RentedFamilyNFTComponent {

  rows: any[] = [];

  constructor(
    private http: HttpClient,
  ) { }


  ngOnInit() {
    const accesstoken = window.sessionStorage.getItem('ACCESS_TOKEN');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${accesstoken}`);

    const url = '/api/getUserRentedNFTs';
    this.http.get(url, {'headers': headers}).toPromise().then((res: any) => {
      console.log(res.data)
      if (res.success) {
        this.rows = res.data;
      }
    }).catch((e: any) => {

    });
  }



}
