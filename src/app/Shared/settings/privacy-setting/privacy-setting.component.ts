import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CommonService } from 'src/app/service/common.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { promise } from 'protractor';

@Component({
  selector: 'app-privacy-setting',
  templateUrl: './privacy-setting.component.html',
  styleUrls: ['./privacy-setting.component.css']
})
export class PrivacySettingComponent implements OnInit {
  privacysettingForm: FormGroup;
  isCreator = false;
  privacySetting: any = [];
  isSubscriber = false;
  keyValue: any;
  userDetail: any[];
  tireList: any = [
    { label: 'Any', value: 'Any' },
    { label: '1+', value: '1+' },
    { label: '2+', value: '2+' },
    { label: '3', value: '3' }
  ];
  constructor(
    private commonservice: CommonService,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService) {

    this.spinner.show();
    this.formInit();
    this.userDetail = commonservice.getLoggedUserDetail();
    if (!(this.userDetail['cognito:groups'])) {
      this.isCreator = false;
      this.isSubscriber = false;
    } else if (this.userDetail['cognito:groups'][0] === 'Creator') {
      this.isCreator = true;
    } else {
      this.isSubscriber = true;
    }



    this.commonservice.get_privacy().subscribe(res => {
      this.privacySetting = res;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toaster.error(err.error['message']);
    });


  }
  formInit = () => {

    this.privacysettingForm = new FormGroup({
      private_profile: new FormControl(''),
      show_subscriptions: new FormControl(''),
      show_subscribers: new FormControl(''),
      hotlink: new FormControl(''),
      tier: new FormControl('')
    });

  }

  ngOnInit() {
  }
  onChange(key, value) {

    if (key === 'private_profile') {
      this.commonservice.update_privacy({ private_profile: value.checked }).subscribe(res => {
        this.toaster.success('Profile Privacy updated successfully.');
        this.commonservice.user_log({ message: 'User update Profile Privacy succesfully!' }).subscribe(res => { });
      }, err => {
        this.toaster.error(err.error['message']);
      });
    } else if (key === 'show_subscriptions') {
      this.commonservice.update_privacy({ show_subscriptions: value.checked }).subscribe(res => {
        this.toaster.success('Show Subscriptions updated successfully.');
        this.commonservice.user_log({ message: 'User update Show Subscriptions succesfully!' }).subscribe(res => { });
      }, err => {
        this.toaster.error(err.error['message']);
      });
    } else if (key === 'show_subscribers') {
      this.commonservice.update_privacy({ show_subscribers: value.checked }).subscribe(res => {
        this.toaster.success('Show Subscriber updated successfully.');
        this.commonservice.user_log({ message: 'User update Show Subscriber  succesfully!' }).subscribe(res => { });
      }, err => {
        this.toaster.error(err.error['message']);
      });
    }

  }

}
