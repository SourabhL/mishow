import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-setting-navigation',
  templateUrl: './setting-navigation.component.html',
  styleUrls: ['./setting-navigation.component.css']
})
export class SettingNavigationComponent implements OnInit {
  isActive = 1;
  isCreator = false;
  isSubscriber = false;
  userDetails: any;
  constructor(
    private commonservice: CommonService,
    private route: ActivatedRoute,
    private router: Router) {
    let url = this.route.snapshot['_routerState'].url.split('/');

    if (url[3] === 'account_setting') {
      this.isActive = 1;
    }
    else if (url[3] === 'payment_setting') {
      this.isActive = 2;
    }
    else if (url[3] === 'subscription_setting') {
      this.isActive = 3;
    }
    else if (url[3] === 'notification_setting') {
      this.isActive = 4;
    }
    else if (url[3] === 'privacy_setting') {
      this.isActive = 5;
    }

    this.userDetails = this.commonservice.getLoggedUserDetail();
    if (this.userDetails['cognito:groups'][0] === 'Creator') {
      this.isCreator = true;
    } else if (this.userDetails['cognito:groups'][0] === 'Subscriber') {
      this.isSubscriber = true;
    }
  }

  ngOnInit() {
  }
  Active(id) {
    this.isActive = id;

    if (id == 1) {
      if (this.isCreator) {
        this.router.navigate(['/creator/settings/account_setting']);
      } else if (this.isSubscriber) {
        this.router.navigate(['/subscriber/settings/account_setting']);
      }
    }
    if (id == 2) {
      if (this.isCreator) {
        this.router.navigate(['/creator/settings/payment_setting/payment']);
      } else if (this.isSubscriber) {
        this.router.navigate(['/subscriber/settings/payment_setting/payment']);
      }
    }

    if (id == 3) {
      if (this.isCreator) {
        this.router.navigate(['/creator/settings/subscription_setting']);
      }
    }

    if (id == 4) {
      if (this.isCreator) {
        this.router.navigate(['/creator/settings/notification_setting']);
      } else if (this.isSubscriber) {
        this.router.navigate(['/subscriber/settings/notification_setting']);
      }
    }

    if (id == 5) {
      if (this.isCreator) {
        this.router.navigate(['/creator/settings/privacy_setting']);
      } else if (this.isSubscriber) {
        this.router.navigate(['/subscriber/settings/privacy_setting']);
      }
    }
  }
}
