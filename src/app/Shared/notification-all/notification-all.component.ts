import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { async } from '@angular/core/testing';
@Component({
  selector: 'app-notification-all',
  templateUrl: './notification-all.component.html',
  styleUrls: ['./notification-all.component.css']
})
export class NotificationAllComponent implements OnInit {
  userDetails: any = [];
  isCreator = false;
  isSubscriber = false;
  allNotification: any = [];
  isNodata = false;

  isPost = false;
  isPack = false;
  isProduct = false;
  isExclusive = false;

  isAll = false;
  isComment = false;
  isLike = false;
  isTip = false;
  isSubscribe = false;


  commentData: any = [];
  likeData: any = [];
  tipData: any = [];
  SubscribeData: any = [];
  allData: any = [];

  postdata: any = [];
  packdata: any = [];
  productdata: any = [];
  exclusivedata: any = [];

  msg = '';

  postTotal = 0;
  packTotal = 0;
  productTotal = 0;
  exclusiveTotal = 0;

  allTotal = 0;
  likeTotal = 0;
  commentTotal = 0;
  tipTotal = 0;
  subscribeTotal = 0;

  liveNotifications: any = [];
  isMatch = false;
  constructor(private commonservice: CommonService, private route: Router) {
    this.userDetails = this.commonservice.getLoggedUserDetail();


    if (this.userDetails['cognito:groups'][0] === 'Creator') {
      this.isCreator = true;
    } else {
      this.isSubscriber = true;
    }
    this.commonservice.allNotifications().subscribe((res: any) => {
      if (this.isCreator) {
        this.isAll = true;
        this.isComment = false;
        this.isLike = false;
        this.isTip = false;
        this.isSubscribe = false;
        res.forEach(e => {
          if (e.viewed === false) {
            if (e.profile[0]) {
              this.onDownloadMedia(e.profile[0].profile_picture).then(image => {
                e.profile_picture = image;
              })
            }
            this.allNotification.push(e);
            this.allData.push(e);


            if (e.event_type === "NEW_SUBSCRIBER") {

              this.SubscribeData.push(e);
            }

            if (e.event_type === "NEW_TIP") {

              this.tipData.push(e);
            }

            if (e.event_type === "NEW_LIKE") {

              this.likeData.push(e);
            }

            if (e.event_type === "NEW_COMMENT") {

              this.commentData.push(e);
            }
          }
        });
        this.allTotal = this.allData.length;
        this.subscribeTotal = this.SubscribeData.length;
        this.commentTotal = this.commentData.length;
        this.likeTotal = this.likeData.length;
        this.tipTotal = this.tipData.length;

        if (this.allData.length === 0) {
          this.isNodata = true;
          this.msg = "No Notifications";
        } else {
          this.isNodata = false;
        }
      } else {


        this.isPost = true;
        this.isPack = false;
        this.isExclusive = false;
        this.isProduct = false;
        res.forEach(e => {

          if (e.viewed === false) {
            if (e.profile[0]) {
              this.onDownloadMedia(e.profile[0].profile_picture).then(image => {
                e.profile_picture = image;
              })
            }

            this.allNotification.push(e)

            if (e.event_type === "NEW_POST") {
              this.onDownloadMedia(e.profile[0].profile_picture).then(image => {
                e.profile_picture = image;
              })
              this.postdata.push(e);
            }

            if (e.event_type === "NEW_PACK") {
              this.onDownloadMedia(e.profile[0].profile_picture).then(image => {
                e.profile_picture = image;
              })
              this.packdata.push(e);
            }

            if (e.event_type === "NEW_PRODUCT") {
              this.onDownloadMedia(e.profile[0].profile_picture).then(async (image: any) => {
                await (e.profile_picture = image);
                this.productdata.push(e);
              })
            }

            if (e.event_type === "NEW_EXCLUSIVE") {
              this.onDownloadMedia(e.profile[0].profile_picture).then(image => {
                e.profile_picture = image;
              })
              this.exclusivedata.push(e);
            }
          }
        });
        this.postTotal = this.postdata.length;
        this.packTotal = this.packdata.length;
        this.exclusiveTotal = this.exclusivedata.length;
        this.productTotal = this.productdata.length;
        if (this.postdata.length === 0) {
          this.isNodata = true;
          this.msg = "No Notifications";
        } else {
          this.isNodata = false;
        }
      }


    }, err => {
      this.isNodata = true;
      this.msg = "No Notifications";
    })



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

  ngOnInit() {

  }

  creatorType(key) {

    if (key === 'all') {
      this.isAll = true;
      this.isComment = false;
      this.isLike = false;
      this.isTip = false;
      this.isSubscribe = false;
      this.allData = [];
      this.allNotification.forEach(e => {
        if (e.viewed === false) {
          this.allData.push(e);
        }
      });
      this.allTotal = this.allData.length;
      if (this.allData.length === 0) {
        this.isNodata = true;
        this.msg = "No Notifications";
      } else {
        this.isNodata = false;
      }
    }

    if (key === 'subscribe') {
      this.isAll = false;
      this.isComment = false;
      this.isLike = false;
      this.isTip = false;
      this.isSubscribe = true;
      this.SubscribeData = [];
      this.allNotification.forEach(e => {
        if (e.viewed === false) {
          if (e.event_type === "NEW_SUBSCRIBER") {
            this.SubscribeData.push(e);
          }
        }
      });

      this.subscribeTotal = this.SubscribeData.length;
      if (this.SubscribeData.length === 0) {
        this.isNodata = true;
        this.msg = "No Notifications";
      } else {
        this.isNodata = false;
      }
    }

    if (key === 'tip') {
      this.isAll = false;
      this.isComment = false;
      this.isLike = false;
      this.isTip = true;
      this.isSubscribe = false;
      this.tipData = [];
      this.allNotification.forEach(e => {
        if (e.viewed === false) {

          if (e.event_type === "NEW_TIP") {
            this.tipData.push(e);
          }
        }
      });

      this.tipTotal = this.tipData.length;
      if (this.tipData.length === 0) {
        this.isNodata = true;
        this.msg = "No Notifications";
      } else {
        this.isNodata = false;
      }
    }

    if (key === 'like') {
      this.isAll = false;
      this.isComment = false;
      this.isLike = true;
      this.isTip = false;
      this.isSubscribe = false;
      this.likeData = [];
      this.allNotification.forEach(e => {
        if (e.viewed === false) {

          if (e.event_type === "NEW_LIKE") {
            this.likeData.push(e);
          }
        }
      });

      this.likeTotal = this.likeData.length;

      if (this.likeData.length === 0) {
        this.isNodata = true;
        this.msg = "No Notifications";
      } else {
        this.isNodata = false;
      }
    }

    if (key === 'comment') {
      this.isAll = false;
      this.isComment = true;
      this.isLike = false;
      this.isTip = false;
      this.isSubscribe = false;
      this.commentData = [];
      this.allNotification.forEach(e => {
        if (e.viewed === false) {

          if (e.event_type === "NEW_COMMENT") {
            this.commentData.push(e);
          }
        }
      });

      this.commentTotal = this.commentData.length;
      if (this.commentData.length === 0) {
        this.isNodata = true;
        this.msg = "No Notifications";
      } else {
        this.isNodata = false;
      }
    }
  }

  type(key) {
    if (key === 'post') {
      this.isPost = true;
      this.isPack = false;
      this.isExclusive = false;
      this.isProduct = false;
      this.postdata = [];
      this.allNotification.forEach(e => {
        if (e.viewed === false) {

          if (e.event_type === "NEW_POST") {
            this.postdata.push(e);
          }
        }
      });
      this.postTotal = this.postdata.length;
      if (this.postdata.length === 0) {
        this.isNodata = true;
        this.msg = "No Notifications";
      } else {
        this.isNodata = false;
      }
    }

    if (key === 'pack') {
      this.isPost = false;
      this.isPack = true;
      this.isExclusive = false;
      this.isProduct = false;
      this.packdata = [];
      this.allNotification.forEach(e => {
        if (e.viewed === false) {

          if (e.event_type === "NEW_PACK") {
            this.packdata.push(e);
          }
        }
      });

      this.packTotal = this.packdata.length;
      if (this.packdata.length === 0) {
        this.isNodata = true;
        this.msg = "No Notifications";
      } else {
        this.isNodata = false;
      }
    }

    if (key === 'product') {
      this.isPost = false;
      this.isPack = false;
      this.isExclusive = false;
      this.isProduct = true;
      this.productdata = [];
      this.allNotification.forEach(e => {
        if (e.viewed === false) {

          if (e.event_type === "NEW_PRODUCT") {
            this.productdata.push(e);
          }
        }
      });

      this.productTotal = this.productdata.length;
      if (this.productdata.length === 0) {
        this.isNodata = true;
        this.msg = "No Notifications";
      } else {
        this.isNodata = false;
      }
    }

    if (key === 'exclusive') {
      this.isPost = false;
      this.isPack = false;
      this.isExclusive = true;
      this.isProduct = false;
      this.exclusivedata = [];
      this.allNotification.forEach(e => {
        if (e.viewed === false) {
          if (e.event_type === "NEW_EXCLUSIVE") {
            this.exclusivedata.push(e);
          }
        }
      });
      this.exclusiveTotal = this.exclusivedata.length;
      if (this.exclusivedata.length === 0) {
        this.isNodata = true;
        this.msg = "No Notifications";
      } else {
        this.isNodata = false;
      }
    }
  }

  navigate(uuid, link) {
    console.log('link=>', link);

    // if (this.isCreator) {

    this.route.navigate(['/' + link]);
    // } else {
    //   this.route.navigate(['/' + link]);
    // }


    // let ans = _.find(this.liveNotifications, { 'uuid': uuid });
    // console.log('ans=>', ans);

    // if (e.uuid === uuid) {

    //   this.isMatch = true
    //   let obj = {
    //     uuid: uuid,
    //     ReceiptHandle: e.ReceiptHandle
    //   }
    //   this.commonservice.viewedNotification(obj).subscribe(res => { })
    // // } else {
    this.commonservice.viewedNotification({ "uuid": uuid }).subscribe(res => { })
    // }



  }

}
