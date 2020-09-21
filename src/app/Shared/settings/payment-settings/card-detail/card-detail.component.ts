import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import * as moment from 'moment';
import { CommonService } from 'src/app/service/common.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CountryService } from 'src/app/service/country.service';
@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.css']
})
export class CardDetailComponent implements OnInit {
  cardForm: FormGroup;
  submitted = false;
  showSpinner = false;
  userDetails: any = [];
  isSubscriber = false;
  isCreator = false;
  minYear = moment(new Date()).format('YYYY');
  maxYear = moment(new Date(new Date().setFullYear(new Date().getFullYear() + 10))).format('YYYY');
  countryList = [
    { label: 'Select any one', value: '' },

  ]
  constructor(private commonservice: CommonService,
    private router: Router,
    private toastr: ToastrService,
    private countryService: CountryService) {
    this.userDetails = this.commonservice.getLoggedUserDetail();
    if (this.userDetails['cognito:groups'][0] === "Creator") {
      this.isCreator = true;
    } else {
      this.isSubscriber = true;
    }


    this.countryService.country.forEach(e => {
      this.countryList.push({ label: e, value: e },)
    });

    this.formInit();
  }

  ngOnInit() {
  }
  formInit = () => {
    this.cardForm = new FormGroup({
      legal_name: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      zipcode: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      cardNumber: new FormControl('', [Validators.required, Validators.pattern(/^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)]),
      cardName: new FormControl('', Validators.required),
      cvv: new FormControl('', Validators.required),
      expirydate: new FormControl('', Validators.required)
    });
  }

  onSubmit(valid) {

    this.submitted = true;
    if (valid) {
      this.showSpinner = true;
      let name = this.cardForm.value.legal_name.split(' ');
      let obj = {
        card_number: this.cardForm.value.cardNumber,
        expiry_date: moment(this.cardForm.value.expirydate).format('YYYY-MM'),

      }

      this.commonservice.addCard(obj).subscribe((card: any) => {
        this.commonservice.user_log({ message: 'User added  card  details successfully!' }).subscribe(res => { });
        let shipObj = {
          customerProfileId: card.customerProfileId,
          shippingAddress: {
            firstName: name[0],
            lastName: name[1],
            address: this.cardForm.value.address,
            city: this.cardForm.value.city,
            state: this.cardForm.value.state,
            zip: this.cardForm.value.zipcode,
            country: this.cardForm.value.country
          },
          setDefaultAddress: false

        }
        this.commonservice.addnewShippingDetail(shipObj).subscribe(ship => {
          this.commonservice.user_log({ message: 'User added shipping address successfully!' }).subscribe(res => { });
        }, err => {
          this.toastr.error(err.error.message);
        });
        this.showSpinner = false;
        this.toastr.success('Card Detail Added successfully');
        this.commonservice.user_log({ message: 'User added card details successfully!' }).subscribe(res => { });
        if (this.isCreator) {

          this.router.navigate(['/creator/settings/payment_setting/payment']);
        } else {
          this.router.navigate(['/subscriber/settings/payment_setting/payment']);
        }
      }, err => {
        this.showSpinner = false;
        this.toastr.error(err.error[0].text);
      });
    } else {
      this.showSpinner = false;
    }
  }

}
