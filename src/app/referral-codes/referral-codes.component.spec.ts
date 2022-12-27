import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralCodesComponent } from './referral-codes.component';

describe('ReferralCodesComponent', () => {
  let component: ReferralCodesComponent;
  let fixture: ComponentFixture<ReferralCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferralCodesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferralCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
