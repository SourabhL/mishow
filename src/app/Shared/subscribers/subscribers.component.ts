import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.css']
})
export class SubscribersComponent implements OnInit {
  SubscriberList: any = [];
  profiles: any = [];
  title: any;
  constructor(
    private route: ActivatedRoute,
    private commonservice: CommonService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {
    console.log('in page=======>');

    this.spinner.show();
    this.commonservice.getProfile_by_id(this.route.snapshot.params.id).subscribe((res: any) => {
      console.log('res=>', res);

      this.profiles = res;
      if (this.route.snapshot.data.title === 'subscriber') {
        if (this.profiles.subscribers_list.length > 0) {
          this.title = 'My Subscribers';
          this.commonservice.account_list('', { profile_ids: this.profiles.subscribers_list }).subscribe((res: any) => {
            res.forEach(e => {
              this.onDownloadMedia(e.profile_picture).then(img => {
                e.profile_picture = img;
              })
            })
            this.SubscriberList = res;
            this.spinner.hide();
          });
        }

      } else if (this.route.snapshot.data.title === 'following') {
        if (this.profiles.subscription_list.length > 0) {
          this.title = 'Following';
          this.commonservice.account_list('', { profile_ids: this.profiles.subscription_list }).subscribe((res: any) => {
            res.forEach(e => {
              this.onDownloadMedia(e.profile_picture).then(img => {
                e.profile_picture = img;
              })
            })
            this.SubscriberList = res;
            this.spinner.hide();
          });
        }

      }
    });
  }

  async onDownloadMedia(files) {
    return new Promise((pass, fail) => {
      this.commonservice.getDownloadPresignURL('download', files).subscribe((data: any) => {

        if (data.url) {
          pass(data.url);
        }
      });
    });
  }


  viewProfile(url) {

    this.router.navigate(['/mi.show/' + url]);
  }

  ngOnInit() {
  }

}
