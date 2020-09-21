import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CommonService } from 'src/app/service/common.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-notification-setting',
  templateUrl: './notification-setting.component.html',
  styleUrls: ['./notification-setting.component.css']
})
export class NotificationSettingComponent implements OnInit {
  notificationSettingForm: FormGroup;
  subscriber_notification: FormGroup;

  creatorNotification: any;
  subscriberNotification: any;
  isCreator = false;
  isSubscriber = false;
  userDetail: any[];
  constructor(
    private commonservice: CommonService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {

    this.spinner.show();
    this.userDetail = this.commonservice.getLoggedUserDetail();
    if (!(this.userDetail['cognito:groups'])) {
      this.isCreator = false;
      this.isSubscriber = false;
    } else if (this.userDetail['cognito:groups'][0] === 'Creator') {
      this.formInit();
      this.commonservice.get_notification().subscribe(res => {
        this.creatorNotification = res;

        this.isCreator = true;
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });

    } else {
      this.commonservice.get_subscriber_notification().subscribe(res => {
        this.subscriberNotification = res;
        this.spinner.hide();
        this.isSubscriber = true;
      }, err => {
        this.spinner.hide();
      });
      this.subscriber_formInit();
    }
  }

  formInit = () => {
    this.notificationSettingForm = new FormGroup({
      new_subscriber: new FormControl(''),
      new_tip: new FormControl(''),
      new_pack_purchase: new FormControl(''),
      product_expiration: new FormControl(''),
      post_goes_live: new FormControl(''),
      new_contribution_to_creator: new FormControl(''),
      mutual_contribution: new FormControl('')
    });
  }

  onCreatorChange(key, value) {
    if (key === 'new_subscriber') {
      this.commonservice.update_notification({ new_subscriber: value.checked }).subscribe(res => {
        this.toastr.success('New Subscriber notifications are updated');
        this.commonservice.user_log({ message: 'User update New Subscriber notifications succesfully!' }).subscribe(res => { });
      }, err => {
        this.toastr.error(err.error['message'], 'Error!', { timeOut: 3000 });
      });
    } else if (key === 'new_tip') {
      this.commonservice.update_notification({ new_tip: value.checked }).subscribe(res => {
        this.toastr.success('New Tips notifications are updated');
        this.commonservice.user_log({ message: 'User update New Tips notifications succesfully!' }).subscribe(res => { });
      }, err => {
        this.toastr.error(err.error['message'], 'Error!', { timeOut: 3000 });
      });
    } else if (key === 'new_pack_purchase') {
      this.commonservice.update_notification({ new_pack_purchase: value.checked }).subscribe(res => {
        this.toastr.success('New Pack Purchases notifications are updated');
        this.commonservice.user_log({ message: 'User update New Pack Purchases notifications succesfully!' }).subscribe(res => { });
      }, err => {
        this.toastr.error(err.error['message'], 'Error!', { timeOut: 3000 });
      });
    } else if (key === 'product_expiration') {
      this.commonservice.update_notification({ product_expiration: value.checked }).subscribe(res => {
        this.toastr.success('Product Expiration notifications are updated');
        this.commonservice.user_log({ message: 'User update Product Expiration notifications succesfully!' }).subscribe(res => { });
      }, err => {
        this.toastr.error(err.error['message'], 'Error!', { timeOut: 3000 });
      });
    } else if (key === 'post_goes_live') {
      this.commonservice.update_notification({ post_goes_live: value.checked }).subscribe(res => {
        this.toastr.success('Post goes live notifications are updated');
        this.commonservice.user_log({ message: 'User update Post goes live notifications succesfully!' }).subscribe(res => { });
      }, err => {
        this.toastr.error(err.error['message'], 'Error!', { timeOut: 3000 });
      });
    } else if (key === 'new_contribution_to_creator') {
      this.commonservice.update_notification({ new_contribution_to_creator: value.checked }).subscribe(res => {
        this.toastr.success('Exclusive Contribution notifications are updated');
        this.commonservice.user_log({ message: 'User update Exclusive Contribution notifications succesfully!' }).subscribe(res => { });
      }, err => {
        this.toastr.error(err.error['message'], 'Error!', { timeOut: 3000 });
      });
    } else if (key === 'mutual_contribution') { }
  }

  subscriber_formInit = () => {
    this.subscriber_notification = new FormGroup({
      new_post_from_creator: new FormControl(''),
      new_pack_from_creator: new FormControl(''),
      new_product_from_creator: new FormControl(''),
      new_exclusives_from_creator: new FormControl(''),
      new_contribution_to_creator: new FormControl('')
    });
  }

  onSubscriberChange(key, value) {
    if (key === 'new_post_from_creator') {
      this.commonservice.update_subscriber_notification({ new_post_from_creator: value.checked }).subscribe(res => {
        this.toastr.success('New post from creator notifications are updated');
        this.commonservice.user_log({ message: 'User update New post from creator notifications succesfully!' }).subscribe(res => { });
      }, err => {
        this.toastr.error(err.error.message);
      });
    } else if (key === 'new_pack_from_creator') {
      this.commonservice.update_subscriber_notification({ new_pack_from_creator: value.checked }).subscribe(res => {
        this.toastr.success('New pack from creator notifications are updated', 'Success!', { timeOut: 3000 });
        this.commonservice.user_log({ message: 'User update New pack from creator notifications succesfully!' }).subscribe(res => { });
      }, err => {
        this.toastr.error(err.error.message);
      });
    } else if (key === 'new_product_from_creator') {
      this.commonservice.update_subscriber_notification({ new_product_from_creator: value.checked }).subscribe(res => {
        this.toastr.success('New product from creator notifications are updated', 'Success!', { timeOut: 3000 });
        this.commonservice.user_log({ message: 'User update New product from creator notifications succesfully!' }).subscribe(res => { });
      }, err => {
        this.toastr.error(err.error.message);
      });
    } else if (key === 'new_exclusives_from_creator') {
      this.commonservice.update_subscriber_notification({ new_exclusives_from_creator: value.checked }).subscribe(res => {
        this.toastr.success('New exclusive from creator notifications are updated', 'Success!', { timeOut: 3000 });
        this.commonservice.user_log({ message: 'User update New exclusive from creator notifications succesfully!' }).subscribe(res => { });
      }, err => {
        this.toastr.error(err.error.message);
      });
    } else if (key === 'new_contribution_to_creator') {
      this.commonservice.update_subscriber_notification({ new_contribution_to_creator: value.checked }).subscribe(res => {
        this.toastr.success('New contribution to creator notifications are updated', 'Success!', { timeOut: 3000 });
        this.commonservice.user_log({ message: 'User update New contribution to creator notifications succesfully!' }).subscribe(res => { });
      }, err => {
        this.toastr.error(err.error.message);
      });
    }
  }
  ngOnInit() {
    this.spinner.hide();
  }

}
