import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-payments-navigation',
  templateUrl: './payments-navigation.component.html',
  styleUrls: ['./payments-navigation.component.css']
})
export class PaymentsNavigationComponent implements OnInit {
  userDetails: any = [];
  isCreator = false;
  isSubscriber = false;
  isApproved: Boolean;
  constructor(private commonservice: CommonService) {
    this.userDetails = this.commonservice.getLoggedUserDetail();
    console.log('his.userDetails=>', this.userDetails);

    if (this.userDetails['cognito:groups'][0] === 'Creator') {
      console.log('in if=======>');

      this.isCreator = true;
      this.commonservice.get_agreement().subscribe((res: any) => {
        if (res.admin.decision === 'APPROVED') {
          this.isApproved = true;
        }
      }, err => {
        this.isApproved = false;
      })
    } else if (this.userDetails['cognito:groups'][0] === 'Subscriber') {
      this.isSubscriber = true;

    }

  }



  ngOnInit() {
  }

}
