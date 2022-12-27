import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentedFamilyNFTComponent } from './rented-family-nft.component';

describe('RentedFamilyNFTComponent', () => {
  let component: RentedFamilyNFTComponent;
  let fixture: ComponentFixture<RentedFamilyNFTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentedFamilyNFTComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentedFamilyNFTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
