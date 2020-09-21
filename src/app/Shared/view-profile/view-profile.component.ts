import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { SelectItem, ConfirmationService } from 'primeng/api';
import { CountryService } from 'src/app/service/country.service';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {
  start = 0;
  limit = 5;
  displayName: any;
  birthdate: any;
  profilePicture: any;
  profileVideo: string;
  about: any;
  location: any;
  userName: any;
  profile_url: any;
  allData: any = [];
  havePost = false;
  isVideo = false;
  medias: any = [];
  userDetails: any = [];
  isVote10 = false;
  isVote9 = false;
  setDefault = false;
  isTipValue = false;
  tipAmount = 0;
  isVote8 = false;
  isVote7 = false;
  isVote6 = false;
  subscriberName: any;
  subscriberImage: any;
  subscriberUserID: any;
  subscriberUsername: any;
  showCommentBox = false;
  comment: any;
  mediaImages: any = [];
  postId: any;
  isUpdateComment = false;
  commentArr: any = [];
  subscriptionStatus: any;
  isActive = false;
  tags: any = [];
  isTag = false;
  isValue = false;
  contribution = 0;
  modalRef: BsModalRef;
  perdayCostNew = 0;
  perdayCostOld = 0;
  netCost = 0;
  title = '';
  packCost: any;
  button = 'Submit';
  productCost: any;
  quantity = 0;
  originalCost = 0;
  remainingQuantity = 0;
  originalQty = 0;
  information: any;
  isAvailQuantity = false;
  isPackPurchase = false;
  isProductPurchase = false;
  isExclusivePurchase = false;
  contributionValue: any = [];
  tierID: any = [];
  isUpgrade = false;
  payType: any;
  payDescription: any;
  payAmount: any;
  payAssetID: any;
  payQuantity: any;
  userID: any;
  state: any;
  infoRequired: any = [];
  remainingDays = 0;
  NotificationID: any;
  usedDays = 0;
  isCardDetails = false;
  cardNumber: any = [];
  savedCard: any = [];
  customerProfileID: any;
  paymentProfileID: any;
  cardForm: FormGroup;
  newCard: FormGroup;
  purchaseWith: any;
  showSpinner = false;
  showSpinnerNew = false;
  submitted = false;
  exclusiveID: any;
  tierValue: any = [];
  isAdd = false;
  isEdit = false;
  infoArray: any = [];
  postImageCount = 0;
  postVideoCount = 0;
  packImageCount = 0;
  packVideoCount = 0;
  productImageCount = 0;
  productVideoCount = 0;
  exclusiveImageCount = 0;
  exclusiveVideoCount = 0;
  totalImageCount = 0;
  totalVideoCount = 0;
  tipType: any = [];
  isCreator = false;
  isSubscriber = false;
  commentID: any;
  countryList = [
    { label: 'Select any one', value: '' },
  ];
  taxes: any = [];
  isTaxShow = false;
  basicTotal: any;
  finalTotal: any;
  taxesAmount: any;
  taxID: any;
  totalSubsciber = 0;
  totalFollowing = 0;
  profileID: any;
  currentSubscription: any = [];
  subscribeData: any = [];
  postLength = 0;
  timelineImage: any;
  showCard = false;
  isTimeline = false;
  contributionsList: any = [{ label: 'Select any one', value: '' }];
  notShow = false;
  profileImage: any;
  minYear = moment(new Date()).format('YYYY');
  maxYear = moment(new Date(new Date().setFullYear(new Date().getFullYear() + 10))).format('YYYY');
  showSubscriber: any;
  showFollowing: any;
  isVerified = false;
  isSubscriberLogged = false;
  tagArray: any = [];
  copiedText = '';
  checkShow = false;
  constructor(
    private route: ActivatedRoute,
    private commonservice: CommonService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: BsModalService,
    private confirmationService: ConfirmationService,
    private countryService: CountryService

  ) {

    this.spinner.show();
    this.userDetails = this.commonservice.getLoggedUserDetail();

    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
    if (route.snapshot.params.profileurl === localStorage.getItem('username')) {
      this.checkShow = false;
    } else {
      this.checkShow = true;
    }
    this.commonservice.viewProfile(route.snapshot.params.profileurl).subscribe((res: any) => {
      if (res.account_type === 2) {
        this.isCreator = true;
        this.commonservice.setViewProfile(res.user_id);
        this.commonservice.setProfileID(res.profile_id);
        this.userID = res.user_id;
        this.profileID = res.profile_id;

        this.totalSubsciber = res.subscribers_list.length;
        this.totalFollowing = res.subscription_list.length;
        this.postLength = res.post_count;
        this.onDownloadMedia(res.profile_picture).then(res => {
          this.profilePicture = res;
        })
        this.displayName = res.display_name;
        this.about = res.about;
        this.profile_url = res.profile_url;
        this.userName = res.profile_url;
        this.location = res.location;
        if (res.timeline_picture) {
          this.isTimeline = true;
          this.onDownloadMedia(res.timeline_picture).then(res => {
            this.timelineImage = res;
          })
        }


        if (res.profile_video) {
          this.isVideo = true;
          this.onDownloadMedia(res.profile_video).then((res: any) => {
            this.profileVideo = res;
          })
        }
        this.getSubscription(this.profileID);

        this.commonservice.getTags(res.user_id).subscribe((res: any) => {
          this.tags = res;
          this.isTag = true;
        });
        this.commonservice.get_agreement_all(this.userID).subscribe((agreemnet: any) => {
          if (agreemnet !== null) {

            if (agreemnet.admin.decision === 'APPROVED') {
              this.isVerified = true;
            }
          }

        });

        this.commonservice.get_privacy_all(this.userID).subscribe((privacy: any) => {
          this.showSubscriber = privacy.show_subscribers;
          this.showFollowing = privacy.show_subscriptions;

        });
        this.feed();

        this.commonservice.get_profile().subscribe((res: any) => {
          this.subscriberUsername = res.profile_url;
          this.subscriberName = res.display_name;
          this.subscriberImage = res.profile_picture;
          this.subscriberUserID = res.user_id;
        });
      } else {
        this.isSubscriber = true;
        this.userID = res.user_id;
        this.profileID = res.profile_id;

        this.totalFollowing = res.subscription_list.length;
        // this.postLength = res.feeds.length;
        this.onDownloadMedia(res.profile_picture).then(res => {
          this.profilePicture = res;
        })
        this.displayName = res.display_name;
        this.about = res.about;
        this.userName = res.profile_url;
        this.location = res.location;
        if (res.timeline_picture) {
          this.isTimeline = true;
          this.onDownloadMedia(res.timeline_picture).then(res => {
            this.timelineImage = res;
          })

        }
      }
    });


    // this.commonservice.getSubscription.subscribe((tier: any) => {
    //   console.log('tier=>', tier);

    //   if (tier !== '') {
    //     this.tierValue = tier;
    //     this.isEdit = true;
    //     this.isAdd = false;
    //   } else {
    //     this.isAdd = true;
    //     this.isEdit = false;
    //   }
    // });
    this.commonservice.get_profile().subscribe((res: any) => {
      if (res.account_type === 5) {
        this.isSubscriberLogged = true;
      } else {
        this.isSubscriberLogged = false;
      }


      this.onDownloadMedia(res.profile_picture).then(res => {
        this.profileImage = res;
      })
    });

    this.countryService.country.forEach(e => {
      this.countryList.push({ label: e, value: e },)
    });


  }


  loadMore(arr) {
    this.start = this.start + this.limit;
    this.commonservice.get_comments_post(arr.post_id, this.start, this.limit).subscribe((res: any) => {

      if (res.length > 0) {
        arr.commentArr = res;
        arr.commentArr.forEach(ele => {

          ele.isModify = false;
          ele.isDelete = false;
          ele.isLike = false;

          let dt = this.commonservice.scheduleDate(ele.created_date);
          let dt1 = this.commonservice.scheduleTime(ele.created_date);
          let dt2 = dt + ' ' + dt1;
          const date = moment(dt2, 'YYYY-MM-DD hh:mm:ss ').format('MMM Do  HH:MMA');
          ele.created_date = date;
          ele.replaytoComment = false;

          if (ele.total_replays > 0) {
            this.commonservice.get_reply(ele.comment_uid, 0, 5).subscribe(res => {
              ele.reply = res;
              ele.reply.forEach(e => {
                let dt = this.commonservice.scheduleDate(e.created_date);
                let dt1 = this.commonservice.scheduleTime(e.created_date);
                let dt2 = dt + ' ' + dt1;
                const date = moment(dt2, 'YYYY-MM-DD hh:mm:ss ').format('MMM Do  HH:MMA');
                e.created_date = date;
                e.isModify = false;
                e.isDelete = false;
              });


            });
          }
        });

      }
    });
  }

  getSubscription(id) {
    this.commonservice.checkSubscription(id).subscribe((res: any) => {

      this.subscriptionStatus = res.subscription_status;
      if (this.subscriptionStatus === 'ACTIVE' || this.subscriptionStatus === 'NEW') {
        this.remainingDays = res.daysRemaining;
        this.tierValue = parseInt(res.tier_id);
        this.isActive = true;

        this.isEdit = true;
        this.isAdd = false;


      } else {
        this.isAdd = true;
        this.isEdit = false;
        this.isActive = false;
      }

    });
  }

  viewProfile(key) {
    this.router.navigate(['/mi.show/' + key]);
  }


  hotlink(id, img) {
    let i = img.split('/');
    this.commonservice.get_hotlink(id, i[3], i[4]).subscribe((res: any) => {
    });
  }

  unsubscribe() {
    if (this.tierValue > 0) {

      this.confirmationService.confirm({
        message: 'Are you sure  you want to unsubscribe this creator , As your subscription is still ACTIVE?',
        accept: () => {

          this.commonservice.unSubscribe(this.profileID).subscribe((res: any) => {
            this.getSubscription(this.profileID);
            this.feed();
            this.toastr.success('Successfully Unsubscribed.');
            this.commonservice.user_log({ message: 'User unsubscribe successfully!' }).subscribe(res => { });
          }, err => {
            this.toastr.error(err.error.message);
          });
        }
      });

    } else {

      this.confirmationService.confirm({
        message: 'Are you sure  you want to unsubscribe this creator?',
        accept: () => {

          this.commonservice.unSubscribe(this.profileID).subscribe((res: any) => {
            this.getSubscription(this.profileID);
            this.feed();
            this.toastr.success('Successfully Unsubscribed.');
            this.commonservice.user_log({ message: 'User unsubscribe successfully!' }).subscribe(res => { });
          }, err => {
            this.toastr.error(err.error.message);
          });
        }
      })

    }

  }



  feed() {
    this.creatorFeed(this.profileID).then((res: any) => {
      this.allData = res[0];
    }).then(res => {
      if (this.allData.posts) {

        this.allData.posts.forEach((e, index) => {

          if (e.tags.length > 0) {
            e.tag = true;
            this.tagArray = [];
            e.tags.forEach(e => {
              if (this.tagArray.length < 5) {
                this.tagArray.push(e);
              }
            });

            e.tags = this.tagArray;
          }
          if (e.media) {
            let medias = {
              image: [],
              video: []
            };
            e.link = "mi.show/" + this.userName + '/post/' + e.post_id;
            e.media.forEach(element => {
              const isImages = ['jpg', 'jpeg', 'png', 'webp'];
              const isVideo = ['mp4'];
              const imgStr = isImages.join(',');
              const videoStr = isVideo.join(',');
              if (imgStr.includes(element.split('.').pop()) === true) {
                this.postImageCount++;
                this.onDownloadMedia(element).then(res => {
                  medias.image.push(res);
                })
              } else {
                this.postVideoCount++;
                this.onDownloadMedia(element).then(res => {
                  medias.video.push(res);
                })
              }
              e['medias'] = medias;
            });
          }


          let dt1 = this.commonservice.scheduleDate(e.publish_date);
          e.publish_date = moment(dt1, 'YYYY-MM-DD').format('MMM DD');


          e.votes.forEach(vote => {
            if ((vote.ten + vote.nine + vote.eight + vote.seven + vote.six) > 0) {
              e.totalVotes = vote.ten + vote.nine + vote.eight + vote.seven + vote.six;
            } else {
              e.totalVotes = 0;
            }
          });

          if (e.score >= 95 && e.totalVotes > 0) {
            e.is100 = true;
          }
          else if (e.score >= 90 && e.score <= 95) {
            e.is90 = true;
          }
          else if (e.score >= 70 && e.score <= 89) {
            e.is80 = true;
          }
          else if (e.score >= 46 && e.score <= 69) {
            e.is70 = true;
          }
          else if (e.score <= 45) {
            e.is60 = true;
          }


        });
      }

      if (this.allData.packs) {
        this.allData.packs.forEach(e => {

          if (e.purchase !== null) {
            let dt1 = this.commonservice.scheduleDate(e.purchase.created_at);
            e.purchase.created_at = moment(dt1, 'YYYY-MM-DD').format('MMM Do');
          }
          if (e.publish_date !== null) {
            let dt1 = this.commonservice.scheduleDate(e.publish_date);
            e.publish_date = moment(dt1, 'YYYY-MM-DD').format('MMM DD');
            e['date'] = moment(e.publish_date).format('MMMDD');
          } else {
            e['date'] = '-'
          }
          e.link = "mi.show/" + this.userName + '/pack/' + e.pack_id;
          if (e.preview_media) {
            let medias = {
              image: [],
              video: []
            };
            e.preview_media.forEach(element => {
              const isImages = ['jpg', 'jpeg', 'png', 'webp'];
              const isVideo = ['mp4'];
              const imgStr = isImages.join(',');
              const videoStr = isVideo.join(',');
              if (imgStr.includes(element.split('.').pop()) === true) {
                this.packImageCount++;
                this.onDownloadMedia(element).then(res => {
                  medias.image.push(res);
                })
              } else {
                this.packVideoCount++;
                this.onDownloadMedia(element).then(res => {
                  medias.video.push(res);
                })
              }
              e['medias'] = medias;
            });
          }
        });
      }

      if (this.allData.products) {
        this.allData.products.forEach(e => {

          if (e.product_tags.length > 0) {
            e.tag = true;
          }

          if (e.purchase !== null) {
            let dt1 = this.commonservice.scheduleDate(e.purchase.created_at);
            e.purchase.created_at = moment(dt1, 'YYYY-MM-DD').format('MMM Do');
          }

          let dt1 = this.commonservice.scheduleDate(e.created_at);
          e.created_at = moment(dt1, 'YYYY-MM-DD').format('MMM DD');
          e.link = "mi.show/" + this.userName + '/product/' + e.product_id;
          e['date'] = moment(e.created_at).format('MMMDD');
          if (e.product_image) {
            let medias = {
              image: [],
              video: []
            };
            e.product_image.forEach(element => {
              const isImages = ['jpg', 'jpeg', 'png', 'webp'];
              const isVideo = ['mp4'];
              const imgStr = isImages.join(',');
              const videoStr = isVideo.join(',');
              if (imgStr.includes(element.split('.').pop()) === true) {
                this.productImageCount++;
                this.onDownloadMedia(element).then(res => {
                  medias.image.push(res);
                })
              } else {
                this.productVideoCount++;
                this.onDownloadMedia(element).then(res => {
                  medias.video.push(res);
                })
              }
              e['medias'] = medias;
            });
          }
        });
      }

      if (this.allData.exclusives) {
        this.allData.exclusives.forEach(e => {
          if (e.goal > e.amount_contributed) {
            e.isContribute = true;
          } else {
            e.isContribute = false;
          }
          if (e.purchase !== null) {
            let dt1 = this.commonservice.scheduleDate(e.purchase.created_at);
            e.purchase.created_at = moment(dt1, 'YYYY-MM-DD').format('MMM Do');
          }
          e.link = "mi.show/" + this.userName + '/exclusive/' + e.exclusive_id;
          let dt1 = this.commonservice.scheduleDate(e.created_on);
          e.created_on = moment(dt1, 'YYYY-MM-DD').format('MMM DD');

          e['date'] = moment(e.created_on, 'DD-MMM');


          if (e.available_now === true) {
            let medias = {
              image: [],
              video: []
            };
            e.exclusive_content.forEach(element => {
              const isImages = ['jpg', 'jpeg', 'png', 'webp'];
              const isVideo = ['mp4'];
              const imgStr = isImages.join(',');
              const videoStr = isVideo.join(',');
              if (imgStr.includes(element.split('.').pop()) === true) {
                this.exclusiveImageCount++;
                this.onDownloadMedia(element).then(res => {
                  medias.image.push(res);
                })

              } else {
                this.exclusiveVideoCount++;
                this.onDownloadMedia(element).then(res => {
                  medias.video.push(res);
                })
              }
              e['medias'] = medias;
            });
          } else {
            let medias = {
              image: [],
              video: []
            };
            e.media.forEach(element => {
              const isImages = ['jpg', 'jpeg', 'png', 'webp'];
              const isVideo = ['mp4'];
              const imgStr = isImages.join(',');
              const videoStr = isVideo.join(',');
              if (imgStr.includes(element.split('.').pop()) === true) {
                this.exclusiveImageCount++;
                this.onDownloadMedia(element).then(res => {
                  medias.image.push(res);
                })
              } else {
                this.exclusiveVideoCount++; this.onDownloadMedia(element).then(res => {
                  medias.video.push(res);
                })
              }
              e['medias'] = medias;
            });
          }

        });


      }



      if (this.allData.posts.length == 0 && this.allData.packs.length == 0 && this.allData.products.length == 0 && this.allData.exclusives.length == 0) {
        this.havePost = false;
      } else {

        this.havePost = true;
      }
      this.totalImageCount = this.postImageCount + this.packImageCount + this.productImageCount + this.exclusiveImageCount;
      this.totalVideoCount = this.postVideoCount + this.packVideoCount + this.productVideoCount + this.exclusiveVideoCount;

      if (this.allData.posts !== '' || this.allData.packs !== '' || this.allData.products !== '') {
        this.spinner.hide();
      } else {
        this.spinner.hide();
      }

    }).catch(err => {
      this.toastr.error(err.error);
    });


  }

  report() {
    this.toastr.success('This post has been reported.');
  }


  onSuccess(e) {

    if (e.text !== '') {
      this.copiedText = e.text;
      this.toastr.success('Link copied to clipboard.');
    }

  }

  onError(e) {
    this.copiedText = 'Error trying to copy your text';
    // this.onError = this.onError.bind(this);
  }

  showSubscribers(key) {

    if (key === 'subscriber') {
      if (this.showSubscriber === true) {
        //   if (this.isSubscriberLogged) {
        this.router.navigate([this.profile_url + '/showsubscribers/' + this.userID]);
        //   } else {
        //     this.router.navigate(['/creator/subscribers/' + this.userID]);
        //   }
      } else {
        this.toastr.info('You have no access to see subscribers.');
      }
    } else {
      if (this.showFollowing === true) {
        //   if (this.isSubscriberLogged) {
        //     this.router.navigate(['/subscribers/following/' + this.userID]);
        //   } else {
        this.router.navigate([this.profile_url + '/following/' + this.userID]);
        // }

      } else {
        this.toastr.info('You have no access to see followings.');
      }
    }

  }


  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    // this.modalRef.setClass('modal-md');
  }

  likeComment(arr) {
    // this.spinner.show();
    this.commonservice.like_comment(arr.comment_uid).subscribe(res => {
      this.toastr.success('Like  the comment!');
      this.NotificationID = arr.post_id;
      let obj = {
        event_type: 'NEW_LIKE',
        user_id: this.userID,
        message: 'New like  from  ' + this.subscriberUsername,
        hyperlink: "/post/" + this.NotificationID,
        from_info: {
          display_name: this.subscriberName,
          profile_url: this.subscriberUsername,
          user_id: this.subscriberUserID
        }
      }
      this.commonservice.creator_notification(obj).subscribe((res: any) => { })
      arr.isLike = true;
      arr.total_likes = arr.total_likes + 1;
      arr.you_liked = true;
      this.commonservice.user_log({ message: 'User like the comment successfully!' }).subscribe(res => { });
      // this.spinner.hide();
    }, err => {
      this.toastr.error(err.error.message);
      // this.spinner.hide();
    });
  }

  // function for load comments
  LoadComments(arr) {
    if (arr.comments === true && arr.total_comments) {

      this.commonservice.get_comments_post(arr.post_id, this.start, this.limit).subscribe((res: any) => {

        if (res.length > 0) {
          arr.commentArr = res;
          arr.commentArr.forEach(ele => {
            this.onDownloadMedia(ele.profile[0].profile_picture).then(image => {
              ele.profile[0].profile_picture = image;
            })
            ele.isModify = false;
            ele.isDelete = false;
            ele.isLike = false;

            let dt = this.commonservice.scheduleDate(ele.created_date);
            let dt1 = this.commonservice.scheduleTime(ele.created_date);
            let dt2 = dt + ' ' + dt1;
            const date = moment(dt2, 'YYYY-MM-DD hh:mm:ss ').format('MMM Do  HH:MMA');
            ele.created_date = date;
            ele.replaytoComment = false;

            if (ele.total_replays > 0) {
              this.commonservice.get_reply(ele.comment_uid, 0, 5).subscribe(res => {

                ele.reply = res;
                ele.reply.forEach(el => {
                  let dt = this.commonservice.scheduleDate(el.created_date);
                  let dt1 = this.commonservice.scheduleTime(el.created_date);
                  let dt2 = dt + ' ' + dt1;
                  const date = moment(dt2, 'YYYY-MM-DD hh:mm:ss ').format('MMM Do  HH:MMA');
                  el.created_date = date;
                  el.isModify = false;
                  el.isDelete = false;
                  this.onDownloadMedia(el.profile[0].profile_picture).then(image => {
                    el.profile[0].profile_picture = image;
                  });
                });


              });
            }


          });

        }
      });


    }
  }

  unlikeComment(arr) {
    this.spinner.show();
    if (arr.you_liked === true) {
      this.commonservice.unlike_comment(arr.comment_uid).subscribe(res => {
        this.toastr.success('unlike the comment!');

        arr.isLike = false;
        arr.total_likes = arr.total_likes - 1;
        arr.you_liked = false;
        this.commonservice.user_log({ message: 'User inlike the comment successfully!' }).subscribe(res => { });
        this.spinner.hide();
      }, err => {
        this.toastr.error(err.error.message);
        this.spinner.hide();
      });
    } else {
      this.toastr.warning('Sorry you did not like this comment!');
    }

  }

  onCustomeTip(e) {
    if (e.target.value > 0) {
      this.tipAmount = e.target.value;
      this.isTipValue = false;
    } else {
      this.isTipValue = true;
    }
  }

  onTipChange(e) {
    this.tipAmount = e;
    if (e > 0) {
      this.isTipValue = false;
    } else {
      this.isTipValue = true;
    }
  }

  OnContributionChange(e) {
    this.payAmount = e.value;
    this.commonservice.addTaxes(this.userID, this.state, this.payType, this.payAmount, { 'revenue_sharing': [] }).subscribe((taxes: any) => {
      this.taxes = taxes;
      this.basicTotal = taxes.item_subtotal;
      this.finalTotal = taxes.total_payment;
      this.taxesAmount = taxes.card_transaction_fee + taxes.state_taxes + taxes.platform_fee_subscriber;
    });
    if (this.payAmount === undefined) {
      this.isValue = true;
    } else {
      this.isValue = false;
    }

  }

  onSubmit(valid, key, temp) {
    this.submitted = true;

    if (this.payType == 'exclusive') {
      if (this.contribution === undefined) {
        this.isValue = true;
      } else {
        this.isValue = false;
      }
      if (valid && !this.isValue) {
        this.showSpinner = true;
        let name = this.cardForm.value.legal_name.split(' ');
        let obj = {
          creator_id: this.userID,

          asset: {
            asset_id: this.payAssetID,
            creator_id: this.userID,
            username: this.userName,
            quantity: this.payQuantity,
            type: this.payType,
            description: this.payDescription
          },
          payment_info: {
            // amount: this.payAmount,s
            item_subtotal: this.taxes.item_subtotal,
            state_taxes: this.taxes.state_taxes,
            platform_fee_subscriber: this.taxes.platform_fee_subscriber,
            card_transaction_fee: this.taxes.card_transaction_fee,
            total_payment: this.taxes.total_payment,
            platform_fee_creator: this.taxes.platform_fee_creator,
            creator_net: this.taxes.creator_net
          },
          creditCard: {
            cardNumber: this.cardForm.value.cardNumber,
            expirationDate: moment(this.cardForm.value.expirydate).format('YYYY-MM'),
            cardCode: this.cardForm.value.cvv,
            cardHolderName: this.cardForm.value.cardName
          },
          billTo: {
            firstName: name[0],
            lastName: name[1],
            address: this.cardForm.value.address,
            city: this.cardForm.value.city,
            state: this.cardForm.value.state,
            zip: this.cardForm.value.zipcode,
            country: this.cardForm.value.country
          },
          shipTo: {
            firstName: name[0],
            lastName: name[1],
            address: this.cardForm.value.address,
            city: this.cardForm.value.city,
            state: this.cardForm.value.state,
            zip: this.cardForm.value.zipcode,
            country: this.cardForm.value.country
          }
        };
        this.commonservice.cardDeatil(obj).subscribe((res: any) => {
          this.showSpinner = false;
          this.toastr.success('Card Detail Added successfully');
          this.commonservice.user_log({ message: 'User added card detail successfully!' }).subscribe(res => { });
          if (this.payType === 'exclusive') {
            this.commonservice.contribute({ exclusive_id: this.exclusiveID, contribution_amount: this.payAmount, transaction_id: res.transId }).subscribe(res => {
              this.toastr.success('Contributed Successfully');
              this.commonservice.user_log({ message: 'User contributed successfully!' }).subscribe(res => { });
              this.modalRef.hide();
              this.modalRef = null;
              this.subscribeData = [];
              this.cardForm.reset();
              this.contributionValue = [];
              this.contributionsList = [];

              this.submitted = false;
            }, err => {
              this.showSpinner = false;
              this.toastr.error(err.error.message);
            });
          }

        }, err => {
          this.showSpinner = false;
          this.toastr.error(err.error.message);
        });
      } else {
        this.showSpinner = false;
      }
    } else if (this.payType === 'product') {
      this.modalRef.hide();
      this.modalRef = null;
      this.openModal(temp);
      this.subscribeData = [];
      this.payAmount = this.productCost;
      this.payQuantity = this.quantity;
      this.purchaseWith = key;
      // this.cardForm.reset();
      this.submitted = false;

    } else {
      if (valid) {
        this.showSpinner = true;
        let name = this.cardForm.value.legal_name.split(' ');
        let obj = {
          creator_id: this.userID,
          asset: {
            asset_id: this.payAssetID,
            creator_id: this.userID,
            username: this.userName,
            quantity: this.payQuantity,
            type: this.payType,
            description: this.payDescription
          },
          payment_info: {
            // amount: this.payAmount,s
            item_subtotal: this.taxes.item_subtotal,
            state_taxes: this.taxes.state_taxes,
            platform_fee_subscriber: this.taxes.platform_fee_subscriber,
            card_transaction_fee: this.taxes.card_transaction_fee,
            total_payment: this.taxes.total_payment,
            platform_fee_creator: this.taxes.platform_fee_creator,
            creator_net: this.taxes.creator_net
          },
          creditCard: {
            cardNumber: this.cardForm.value.cardNumber,
            expirationDate: moment(this.cardForm.value.expirydate).format('YYYY-MM'),
            cardCode: this.cardForm.value.cvv,
            cardHolderName: this.cardForm.value.cardName
          },
          billTo: {
            firstName: name[0],
            lastName: name[1],
            address: this.cardForm.value.address,
            city: this.cardForm.value.city,
            state: this.cardForm.value.state,
            zip: this.cardForm.value.zipcode,
            country: this.cardForm.value.country
          },
          shipTo: {
            firstName: name[0],
            lastName: name[1],
            address: this.cardForm.value.address,
            city: this.cardForm.value.city,
            state: this.cardForm.value.state,
            zip: this.cardForm.value.zipcode,
            country: this.cardForm.value.country
          }
        };


        this.commonservice.cardDeatil(obj).subscribe((res: any) => {
          this.showSpinner = false;
          this.toastr.success('Card Detail Added successfully');
          this.commonservice.user_log({ message: 'User added card detail successfully!' }).subscribe(res => { });
          if (this.payType === 'exclusive') {
            this.commonservice.contribute({ exclusive_id: this.exclusiveID, contribution_amount: this.payAmount, transaction_id: res.transId }).subscribe(res => {
              this.toastr.success('Contributed Successfully');
              this.commonservice.user_log({ message: 'User contributed successfully!' }).subscribe(res => { });
              this.modalRef.hide();
              this.modalRef = null;
              this.cardForm.reset();
              this.submitted = false;

            }, err => {
              this.showSpinner = false;
              this.toastr.error(err.error.message);
            });
          }

          if (this.payType === 'tip' && this.tipType !== 'comment') {
            this.modalRef.hide();
            this.modalRef = null;
            this.subscribeData = [];
            this.cardForm.reset();
            this.submitted = false;
            let obj = {
              event_type: 'NEW_TIP',
              user_id: this.userID,
              message: 'New tip from ' + this.subscriberUsername
            }
            this.commonservice.creator_notification(obj).subscribe((res: any) => { })

          }

          if (this.payType === 'subscription_upgrade' && this.isUpgrade) {
            this.commonservice.upgradeSubscription(this.profileID, this.payQuantity, res.transId).subscribe(res => {

              this.getSubscription(this.profileID);
              this.feed();
              this.toastr.success('Subscription updated successfully');
              this.commonservice.user_log({ message: 'User update subscription successfully!' }).subscribe(res => { });
              this.modalRef.hide();
              this.subscribeData = [];
              this.modalRef = null;
              this.cardForm.reset();
              this.submitted = false;
            }, err => {
              this.showSpinner = false;
              this.toastr.error(err.error.message);
            });
          }

          if (this.payType === 'subscription') {
            this.commonservice.subscribeWithPurchase(this.profileID, this.tierID.tier_id, res.transId).subscribe(res => {
              let obj = {
                event_type: 'NEW_SUBSCRIBER',
                user_id: this.userID,
                message: this.subscriberUsername + ' Subscribed to you',
                from_info: {
                  display_name: this.subscriberName,
                  profile_url: this.subscriberUsername,
                  user_id: this.subscriberUserID
                }
              }
              this.commonservice.creator_notification(obj).subscribe((res: any) => { })
              this.getSubscription(this.profileID);
              this.feed();
              this.toastr.success('Subscribe Successfully');
              this.commonservice.user_log({ message: 'User subscribe successfully!' }).subscribe(res => { });
              this.modalRef.hide();
              this.subscribeData = [];
              this.modalRef = null;
              this.cardForm.reset();
              this.submitted = false;
            }, err => {
              this.showSpinner = false;
              this.toastr.error(err.error.message);
            });
          }

          if (this.payType === 'pack') {
            if (this.isSubscriberLogged) {
              this.router.navigate(['/subscriber/viewpack/' + this.payAssetID]);
            } else {
              this.router.navigate(['/creator/viewpack/' + this.payAssetID]);
            }
            this.modalRef.hide();
            this.subscribeData = [];
            this.modalRef = null;
            this.showCard = false;
            this.newCard.reset();
            this.submitted = false;
          }

          if (this.payType === 'tip' && this.tipType === 'comment') {
            this.commonservice.tip_comment(this.commentID.post_id, this.commentID.comment_uid, res.transId).subscribe(res => {

              this.toastr.success('Give tip to comment successfully');
              let obj = {
                event_type: 'NEW_TIP',
                user_id: this.userID,
                message: 'New tip from ' + this.subscriberUsername + ' on the Comment',
                hyperlink: "/post/" + this.NotificationID,
                from_info: {
                  display_name: this.subscriberName,
                  profile_url: this.subscriberUsername,
                  user_id: this.subscriberUserID
                }
              }
              this.commonservice.creator_notification(obj).subscribe((res: any) => { })
              this.commonservice.user_log({ message: 'User Give tip to comment successfully!' }).subscribe(res => { });
              this.modalRef.hide();
              this.modalRef = null;
              this.subscribeData = [];
              this.cardForm.reset();
              this.submitted = false;
            }, err => {
              this.showSpinner = false;
              this.toastr.error(err.error.message);
            });
          }
        }, err => {
          this.showSpinner = false;
          this.toastr.error(err.error.message);
        });
      } else {
        this.showSpinner = false;
      }
    }

  }

  card(id, key, temp) {
    this.spinner.show();
    this.paymentProfileID = id;
    let obj = {
      creator_id: this.userID,
      asset: {
        asset_id: this.payAssetID,
        creator_id: this.userID,
        username: this.userName,
        quantity: this.payQuantity,
        type: this.payType,
        description: this.payDescription
      },
      payment_info: {
        // amount: this.payAmount,s
        item_subtotal: this.taxes.item_subtotal,
        state_taxes: this.taxes.state_taxes,
        platform_fee_subscriber: this.taxes.platform_fee_subscriber,
        card_transaction_fee: this.taxes.card_transaction_fee,
        total_payment: this.taxes.total_payment,
        platform_fee_creator: this.taxes.platform_fee_creator,
        creator_net: this.taxes.creator_net
      },
      customerProfileId: this.customerProfileID,
      paymentProfileId: this.paymentProfileID
    };

    if (this.payType === 'exclusive') {

      if (this.payAmount === undefined) {
        this.isValue = true;
      } else {
        this.isValue = false;
      }

      if (!this.isValue) {
        this.showSpinner = true;

        this.commonservice.cardDeatil(obj).subscribe((res: any) => {

          this.toastr.success('Card Detail Added successfully');
          if (this.payType === 'exclusive') {
            this.commonservice.contribute({ exclusive_id: this.exclusiveID, contribution_amount: this.payAmount, transaction_id: res.transId }).subscribe(res => {
              this.toastr.success('Contributed Successfully');
              this.showSpinner = false;
              this.commonservice.user_log({ message: 'User contributed successfully!' }).subscribe(res => { });
              this.modalRef.hide();
              this.modalRef = null;
              this.showCard = false;
              this.subscribeData = [];
              this.newCard.reset();
              this.submitted = false;
              this.contributionValue = [];
              this.contributionsList = [];
              this.savedCard = [];
              this.feed();
              this.spinner.hide();
            }, err => {
              this.showSpinner = false;
              this.toastr.error(err.error.message);
            });
          }

        }, err => {

          this.toastr.error(err[0].text);
          this.spinner.hide();
          this.modalRef.hide();
          this.modalRef = null;
          this.showSpinner = false;
        });
      }

    } else if (this.payType === 'product') {
      this.modalRef.hide();
      this.modalRef = null;
      this.openModal(temp);
      this.subscribeData = [];
      this.payAmount = this.productCost;
      this.payQuantity = this.quantity;
      this.purchaseWith = key;
      this.showCard = false;
      this.spinner.hide();
      // this.newCard.reset();
      this.submitted = false;
      this.savedCard = [];
    } else {
      this.showSpinner = true;
      this.commonservice.cardDeatil(obj).subscribe((res: any) => {
        this.showSpinner = false;
        this.toastr.success('Card Detail Added successfully');

        if (this.payType === 'tip' && this.tipType !== 'comment') {
          let obj = {
            event_type: 'NEW_TIP',
            user_id: this.userID,
            message: 'New tip from ' + this.subscriberUsername,

          }
          this.commonservice.creator_notification(obj).subscribe((res: any) => { })
          this.modalRef.hide();
          this.spinner.hide();
          this.modalRef = null;
          this.showCard = false;
          this.subscribeData = [];
          this.newCard.reset();
          this.submitted = false;
          this.savedCard = [];
        }

        if (this.payType === 'pack') {
          if (this.isSubscriberLogged) {
            this.router.navigate(['/subscriber/viewpack/' + this.payAssetID]);
          } else {
            this.router.navigate(['/creator/viewpack/' + this.payAssetID]);
          }
          this.modalRef.hide();
          this.modalRef = null;
          this.subscribeData = [];
          this.showCard = false;
          this.newCard.reset();
          this.submitted = false;
          this.savedCard = [];
          this.feed();
          this.spinner.hide();
        }

        if (this.payType === 'subscription_upgrade' && this.isUpgrade) {
          this.commonservice.upgradeSubscription(this.profileID, this.payQuantity, res.transId).subscribe(res => {
            this.getSubscription(this.profileID);
            this.feed();
            this.toastr.success('Subscription updated successfully');
            this.commonservice.user_log({ message: 'User update subscription successfully!' }).subscribe(res => { });
            this.modalRef.hide();
            this.modalRef = null;
            this.subscribeData = [];
            this.showCard = false;
            this.newCard.reset();
            this.submitted = false;
            this.savedCard = [];
            this.spinner.hide();
          }, err => {
            this.spinner.hide();
            this.showSpinner = false;
            this.toastr.error(err.error.message);
          });
        }

        if (this.payType === 'subscription' && !this.isUpgrade) {
          this.commonservice.subscribeWithPurchase(this.profileID, this.tierID.tier_id, res.transId).subscribe(res => {
            let obj = {
              event_type: 'NEW_SUBSCRIBER',
              user_id: this.userID,
              message: this.subscriberUsername + ' Subscribed to you',
              from_info: {
                display_name: this.subscriberName,
                profile_url: this.subscriberUsername,
                user_id: this.subscriberUserID
              }
            }
            this.commonservice.creator_notification(obj).subscribe((res: any) => { })
            this.getSubscription(this.profileID);
            this.feed();
            this.toastr.success('Subscribe Successfully');
            this.commonservice.user_log({ message: 'User subscribe successfully!' }).subscribe(res => { });
            this.modalRef.hide();
            this.modalRef = null;
            this.subscribeData = [];
            this.showCard = false;
            this.newCard.reset();
            this.submitted = false;
            this.savedCard = [];
            this.spinner.hide();
          }, err => {
            this.spinner.hide();
            this.showSpinner = false;
            this.toastr.error(err.error.message);
          });
        }


        if (this.payType === 'tip' && this.tipType === 'comment') {
          this.commonservice.tip_comment(this.commentID.post_id, this.commentID.comment_uid, res.transId).subscribe(res => {
            this.toastr.success('Give tip to comment successfully');
            let obj = {

              event_type: 'NEW_TIP',
              user_id: this.userID,
              message: 'new tip from ' + this.subscriberUsername + ' on the Comment',
              hyperlink: "/post/" + this.NotificationID,
              from_info: {
                display_name: this.subscriberName,
                profile_url: this.subscriberUsername,
                user_id: this.subscriberUserID
              }

            }
            this.commonservice.creator_notification(obj).subscribe((res: any) => { })
            this.commonservice.user_log({ message: 'User Give tip to comment successfully!' }).subscribe(res => { });
            this.modalRef.hide();
            this.modalRef = null;
            this.subscribeData = [];
            this.feed();
            this.showCard = false;
            this.spinner.hide();
            this.newCard.reset();
            this.submitted = false;
            this.savedCard = [];

          }, err => {
            this.spinner.hide();
            this.showSpinner = false;
            this.toastr.error(err.error.message);
          });
        }


      }, err => {
        this.spinner.hide();
        this.showSpinner = false;
        this.toastr.error(err.error.message);
      });
    }


  }

  onNewcardSubmit(valid, key, temp) {
    this.spinner.show();
    this.submitted = true;
    let name = this.newCard.value.newLegalName.split(' ');
    let obj = {
      customerProfileId: this.customerProfileID,

      billTo: {
        firstName: name[0],
        lastName: name[1],
        address: this.newCard.value.newAddress,
        city: this.newCard.value.newCity,
        state: this.newCard.value.newState,
        zip: this.newCard.value.newZipcode,
        country: this.newCard.value.newCountry,
      },
      payment_info: {
        // amount: this.payAmount,s
        item_subtotal: this.taxes.item_subtotal,
        state_taxes: this.taxes.state_taxes,
        platform_fee_subscriber: this.taxes.platform_fee_subscriber,
        card_transaction_fee: this.taxes.card_transaction_fee,
        total_payment: this.taxes.total_payment,
        platform_fee_creator: this.taxes.platform_fee_creator,
        creator_net: this.taxes.creator_net
      },
      card_info: {
        cardNumber: this.newCard.value.newCardNumber,
        expirationDate: moment(this.newCard.value.newExpirydate).format('YYYY-MM'),
        cardCode: this.newCard.value.newCvv,
        cardHolderName: this.newCard.value.newCardName
      },
      setDefaultCard: this.setDefault
    };

    let shipObj = {
      customerProfileId: this.customerProfileID,
      shippingAddress: {
        firstName: name[0],
        lastName: name[1],
        // company: Individual,
        address: this.newCard.value.newAddress,
        city: this.newCard.value.newCity,
        state: this.newCard.value.newState,
        zip: this.newCard.value.newZipcode,
        country: this.newCard.value.newCountry,
        // phoneNumber: 1234567890,
        // faxNumber:
      },
      setDefaultAddress: false

    }
    if (this.payType === 'exclusive') {
      if (this.payAmount === undefined) {
        this.isValue = true;
      } else {
        this.isValue = false;
      }
      if (valid && !this.isValue) {
        this.showSpinnerNew = true;
        this.commonservice.addnewShippingDetail(shipObj).subscribe(ship => { }, err => {
          this.toastr.error(err.error.message);
        });
        this.commonservice.addNewDetails(obj).subscribe((newCard: any) => {
          let pay = {
            creator_id: this.userID,
            asset: {
              asset_id: this.payAssetID,
              creator_id: this.userID,
              username: this.userName,
              quantity: this.payQuantity,
              type: this.payType,
              description: this.payDescription
            },
            payment_info: {
              // amount: this.payAmount,s
              item_subtotal: this.taxes.item_subtotal,
              state_taxes: this.taxes.state_taxes,
              platform_fee_subscriber: this.taxes.platform_fee_subscriber,
              card_transaction_fee: this.taxes.card_transaction_fee,
              total_payment: this.taxes.total_payment,
              platform_fee_creator: this.taxes.platform_fee_creator,
              creator_net: this.taxes.creator_net
            },
            customerProfileId: newCard.customerProfileID,
            paymentProfileId: newCard.paymentProfileID
          };
          this.toastr.success('Card Added successfully');
          this.commonservice.user_log({ message: 'User added new card successfully!' }).subscribe(res => { });


          this.commonservice.cardDeatil(pay).subscribe((card: any) => {
            if (this.payType === 'exclusive') {
              this.commonservice.contribute({ exclusive_id: this.exclusiveID, contribution_amount: this.payAmount, transaction_id: card.transId }).subscribe(res => {
                this.toastr.success('Contributed Successfully');
                this.commonservice.user_log({ message: 'User contributed successfully!' }).subscribe(res => { });
                this.modalRef.hide();
                this.modalRef = null;
                this.showCard = false;
                this.subscribeData = [];
                this.showSpinnerNew = false;
                this.newCard.reset();
                this.contributionValue = [];
                this.contributionsList = [];
                this.submitted = false;
                this.savedCard = [];
                this.feed();
                this.spinner.hide();
              }, err => {
                this.spinner.hide();
                this.showSpinnerNew = false;
                this.toastr.error(err.error.message);
              });
            }
          })
        }, err => {
          this.showSpinnerNew = false;
          this.toastr.error(err.error.message);
        });
      }
    } else if (this.payType === 'product') {
      this.modalRef.hide();
      this.modalRef = null;
      this.subscribeData = [];
      this.openModal(temp);
      this.payAmount = this.productCost;
      this.payQuantity = this.quantity;
      this.purchaseWith = key;
      this.showCard = false;
      this.spinner.hide();
      // this.newCard.reset();
      this.submitted = false;
      this.savedCard = [];
    } else {
      if (valid) {
        this.showSpinnerNew = true;

        this.commonservice.addnewShippingDetail(shipObj).subscribe(ship => { }, err => {
          this.toastr.error(err.error.message);
        });


        this.commonservice.addNewDetails(obj).subscribe((newCard: any) => {
          if (newCard) {
            let pay = {
              creator_id: this.userID,
              asset: {
                asset_id: this.payAssetID,
                creator_id: this.userID,
                username: this.userName,
                quantity: this.payQuantity,
                type: this.payType,
                description: this.payDescription
              },
              payment_info: {
                // amount: this.payAmount,s
                item_subtotal: this.taxes.item_subtotal,
                state_taxes: this.taxes.state_taxes,
                platform_fee_subscriber: this.taxes.platform_fee_subscriber,
                card_transaction_fee: this.taxes.card_transaction_fee,
                total_payment: this.taxes.total_payment,
                platform_fee_creator: this.taxes.platform_fee_creator,
                creator_net: this.taxes.creator_net
              },
              customerProfileId: newCard.customerProfileId,
              paymentProfileId: newCard.customerPaymentProfileId
            };
            this.commonservice.cardDeatil(pay).subscribe((card: any) => {

              this.toastr.success('Card Added successfully');
              this.commonservice.user_log({ message: 'User added new card successfully!' }).subscribe(res => { });

              if (this.payType === 'tip' && this.tipType !== 'comment') {
                let obj = {
                  event_type: 'NEW_TIP',
                  user_id: this.userID,
                  message: 'New tip from ' + this.subscriberUsername
                }
                this.commonservice.creator_notification(obj).subscribe((res: any) => { })

                this.modalRef.hide();
                this.modalRef = null;
                this.subscribeData = [];
                this.showSpinnerNew = false;
                this.showCard = false;
                this.newCard.reset();
                this.submitted = false;
                this.savedCard = [];
              }

              if (this.payType === 'subscription_upgrade' && this.isUpgrade) {
                this.commonservice.upgradeSubscription(this.profileID, this.payQuantity, card.transId).subscribe(res => {
                  this.toastr.success('Subscription updated successfully');
                  this.getSubscription(this.profileID);
                  this.feed();
                  this.commonservice.user_log({ message: 'User update subscription successfully!' }).subscribe(res => { });
                  this.modalRef.hide();
                  this.modalRef = null;
                  this.subscribeData = [];
                  this.showCard = false;
                  this.newCard.reset();
                  this.submitted = false;
                  this.savedCard = [];
                  this.spinner.hide();
                }, err => {
                  this.showSpinnerNew = false;
                  this.toastr.error(err.error.message);
                });
              }

              if (this.payType === 'pack') {
                if (this.isSubscriberLogged) {
                  this.router.navigate(['/subscriber/viewpack/' + this.payAssetID]);
                } else {
                  this.router.navigate(['/creator/viewpack/' + this.payAssetID]);
                }
                this.modalRef.hide();
                this.modalRef = null;
                this.subscribeData = [];
                this.showCard = false;
                this.newCard.reset();
                this.submitted = false;
                this.savedCard = [];
                this.feed();
                this.spinner.hide();
              }

              if (this.payType === 'subscription' && !this.isUpgrade) {
                this.commonservice.subscribeWithPurchase(this.profileID, this.tierID.tier_id, card.transId).subscribe(res => {
                  let obj = {
                    event_type: 'NEW_SUBSCRIBER',
                    user_id: this.userID,
                    message: this.subscriberUsername + ' Subscribed to you',
                    from_info: {
                      display_name: this.subscriberName,
                      profile_url: this.subscriberUsername,
                      user_id: this.subscriberUserID
                    }
                  };
                  this.commonservice.creator_notification(obj).subscribe((res: any) => { })
                  this.getSubscription(this.profileID);
                  this.feed();
                  this.toastr.success('Subscribe Successfully');
                  this.commonservice.user_log({ message: 'User subscribe successfully!' }).subscribe(res => { });
                  this.modalRef.hide();
                  this.modalRef = null;
                  this.subscribeData = [];
                  this.showCard = false;
                  this.newCard.reset();
                  this.submitted = false;
                  this.savedCard = [];
                  this.spinner.hide();
                }, err => {
                  this.spinner.hide();
                  this.showSpinnerNew = false;
                  this.toastr.error(err.error.message);
                });
              }

              if (this.payType === 'tip' && this.tipType === 'comment') {
                this.commonservice.tip_comment(this.commentID.post_id, this.commentID.comment_uid, card.transId).subscribe(res => {
                  this.toastr.success('Give tip to comment successfully');
                  let obj = {
                    event_type: 'NEW_TIP',
                    user_id: this.userID,
                    message: 'New tip from ' + this.subscriberUsername + ' on the Comment',
                    hyperlink: "/post/" + this.NotificationID,
                    from_info: {
                      display_name: this.subscriberName,
                      profile_url: this.subscriberUsername,
                      user_id: this.subscriberUserID
                    }
                  }
                  this.commonservice.creator_notification(obj).subscribe((res: any) => { })
                  this.commonservice.user_log({ message: 'User Give tip to comment successfully!' }).subscribe(res => { });
                  this.modalRef.hide();
                  this.modalRef = null;
                  this.subscribeData = [];
                  this.showCard = false;
                  this.newCard.reset();
                  this.submitted = false;
                  this.savedCard = [];
                  this.spinner.hide();
                }, err => {
                  this.spinner.hide();
                  this.showSpinnerNew = false;
                  this.toastr.error(err.error.message);
                });
              }
            }, err => {
              this.spinner.hide();
              this.toastr.error(err.error.message);
              this.showSpinnerNew = false;
            });
          }

        }, err => {
          this.spinner.hide();
          this.toastr.error(err.error.message);
          this.showSpinnerNew = false;
        });
      }
    }
  }

  buyProduct() {
    this.spinner.show();
    this.showSpinner = true;
    if (this.purchaseWith === 'oldcard') {
      let obj = {
        creator_id: this.userID,
        asset: {
          asset_id: this.payAssetID,
          creator_id: this.userID,
          username: this.userName,
          quantity: this.payQuantity,
          type: this.payType,
          description: this.payDescription
        },
        payment_info: {
          // amount: this.payAmount,s
          item_subtotal: this.taxes.item_subtotal,
          state_taxes: this.taxes.state_taxes,
          platform_fee_subscriber: this.taxes.platform_fee_subscriber,
          card_transaction_fee: this.taxes.card_transaction_fee,
          total_payment: this.taxes.total_payment,
          platform_fee_creator: this.taxes.platform_fee_creator,
          creator_net: this.taxes.creator_net
        },
        customerProfileId: this.customerProfileID,
        paymentProfileId: this.paymentProfileID,
        notes: {}
      };
      obj.notes[this.infoRequired] = this.information;
      this.commonservice.cardDeatil(obj).subscribe((res: any) => {

        this.toastr.success('Card Detail Added successfully');

        this.showSpinner = false;
        this.commonservice.user_log({ message: 'User buy a product successfully!' }).subscribe(res => { });
        this.modalRef.hide();
        this.subscribeData = [];
        this.modalRef = null;
        this.savedCard = [];
        this.showCard = false;
        this.newCard.reset();
        this.submitted = false;
        this.toastr.success('Product purchase successfully!');


        this.commonservice.modifyQty(this.payAssetID, this.payQuantity).subscribe(res => { })
        this.spinner.hide();

      }, err => {
        this.showSpinner = false;
        this.toastr.error(err.error.message);
      });
    }
    if (this.purchaseWith === 'newcard') {
      let name = this.newCard.value.newLegalName.split(' ');
      let obj1 = {
        customerProfileId: this.customerProfileID,

        billTo: {
          firstName: name[0],
          lastName: name[1],
          address: this.newCard.value.newAddress,
          city: this.newCard.value.newCity,
          state: this.newCard.value.newState,
          zip: this.newCard.value.newZipcode,
          country: this.newCard.value.newCountry,
        },
        payment_info: {
          // amount: this.payAmount,s
          item_subtotal: this.taxes.item_subtotal,
          state_taxes: this.taxes.state_taxes,
          platform_fee_subscriber: this.taxes.platform_fee_subscriber,
          card_transaction_fee: this.taxes.card_transaction_fee,
          total_payment: this.taxes.total_payment,
          platform_fee_creator: this.taxes.platform_fee_creator,
          creator_net: this.taxes.creator_net
        },
        card_info: {
          cardNumber: this.newCard.value.newCardNumber,
          expirationDate: moment(this.newCard.value.newExpirydate).format('YYYY-MM'),
          cardCode: this.newCard.value.newCvv,
          cardHolderName: this.newCard.value.newCardName
        },
        setDefaultCard: this.setDefault
      };

      let shipObj = {
        customerProfileId: this.customerProfileID,
        shippingAddress: {
          firstName: name[0],
          lastName: name[1],
          // company: Individual,
          address: this.newCard.value.newAddress,
          city: this.newCard.value.newCity,
          state: this.newCard.value.newState,
          zip: this.newCard.value.newZipcode,
          country: this.newCard.value.newCountry,
          // phoneNumber: 1234567890,
          // faxNumber:
        },
        setDefaultAddress: false

      }

      this.commonservice.addnewShippingDetail(shipObj).subscribe(ship => { }, err => {
        this.toastr.error(err.error.message);
      });
      this.commonservice.addNewDetails(obj1).subscribe((newCard: any) => {
        this.showSpinner = false;
        this.toastr.success('Card Added successfully');
        this.commonservice.user_log({ message: 'User added new card successfully!' }).subscribe(res => { });
        if (newCard) {
          let pay = {
            creator_id: this.userID,
            asset: {
              asset_id: this.payAssetID,
              creator_id: this.userID,
              username: this.userName,
              quantity: this.payQuantity,
              type: this.payType,
              description: this.payDescription
            },
            payment_info: {
              // amount: this.payAmount,s
              item_subtotal: this.taxes.item_subtotal,
              state_taxes: this.taxes.state_taxes,
              platform_fee_subscriber: this.taxes.platform_fee_subscriber,
              card_transaction_fee: this.taxes.card_transaction_fee,
              total_payment: this.taxes.total_payment,
              platform_fee_creator: this.taxes.platform_fee_creator,
              creator_net: this.taxes.creator_net
            },
            customerProfileId: newCard.customerProfileId,
            paymentProfileId: newCard.customerPaymentProfileId
          };
          this.commonservice.cardDeatil(pay).subscribe((card: any) => {

            this.commonservice.modifyQty(this.payAssetID, this.payQuantity).subscribe(res => { })
            this.modalRef.hide();
            this.modalRef = null;
            this.showCard = false;
            this.subscribeData = [];
            this.newCard.reset();
            this.submitted = false;
            this.savedCard = [];
            this.toastr.success('User buy product successfully!');
            this.spinner.hide();
          }, err => {
            this.showSpinner = false;
            this.toastr.error(err.error.message);
          });
        }

      }, err => {
        this.showSpinner = false;
        this.toastr.error(err.error.message);
      });
    }

    if (this.purchaseWith === 'firstpay') {


      let name = this.cardForm.value.legal_name.split(' ');
      let obj = {
        creator_id: this.userID,
        asset: {
          asset_id: this.payAssetID,
          creator_id: this.userID,
          username: this.userName,
          quantity: this.payQuantity,
          type: this.payType,
          description: this.payDescription
        },
        payment_info: {
          // amount: this.payAmount,s
          item_subtotal: this.taxes.item_subtotal,
          state_taxes: this.taxes.state_taxes,
          platform_fee_subscriber: this.taxes.platform_fee_subscriber,
          card_transaction_fee: this.taxes.card_transaction_fee,
          total_payment: this.taxes.total_payment,
          platform_fee_creator: this.taxes.platform_fee_creator,
          creator_net: this.taxes.creator_net
        },
        creditCard: {
          cardNumber: this.cardForm.value.cardNumber,
          expirationDate: moment(this.cardForm.value.expirydate).format('YYYY-MM'),
          cardCode: this.cardForm.value.cvv,
          cardHolderName: this.cardForm.value.cardName
        },
        billTo: {
          firstName: name[0],
          lastName: name[1],
          address: this.cardForm.value.address,
          city: this.cardForm.value.city,
          state: this.cardForm.value.state,
          zip: this.cardForm.value.zipcode,
          country: this.cardForm.value.country
        },
        shipTo: {
          firstName: name[0],
          lastName: name[1],
          address: this.cardForm.value.address,
          city: this.cardForm.value.city,
          state: this.cardForm.value.state,
          zip: this.cardForm.value.zipcode,
          country: this.cardForm.value.country
        }
      };
      this.commonservice.cardDeatil(obj).subscribe((res: any) => {

        this.commonservice.modifyQty(this.payAssetID, this.payQuantity).subscribe(res => { })
        this.showSpinner = false;
        this.toastr.success('Card Detail Added successfully');
        this.commonservice.user_log({ message: 'User added card detail successfully!' }).subscribe(res => { });

        this.modalRef.hide();
        this.modalRef = null;
        this.showCard = false;
        this.subscribeData = [];
        this.cardForm.reset();
        this.submitted = false;
        this.savedCard = [];
        this.toastr.success('Purchase the product successfully!');
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        this.showSpinner = false;
        this.toastr.error(err.error.message);
      });
    }

  }

  viewPack(id) {
    if (this.isSubscriberLogged) {
      this.router.navigate(['/subscriber/viewpack/' + id]);
    } else {
      this.router.navigate(['/creator/viewpack/' + id]);
    }
  }

  deleteCard(arr) {
    // this.confirmationService.confirm({
    //   message: 'Are you sure  you want to delete your card information?',
    //   accept: () => {
    this.commonservice.deleteCard(arr.paymentProfileID).subscribe(res => {
      arr.show = false;
      this.toastr.success('Card Deleted successfully');
    }, err => {
      this.toastr.error(err.error.message);
    })
    //   }
    // })
  }

  reply(arr) {
    this.commentID = arr;
    arr.replaytoComment = true;

  }



  onContributionBlur(e) {
    if (e.target.value > 0) {
      this.contribution = e.target.value;
      this.isValue = false;
    } else {
      this.isValue = true;
    }
  }

  formInit = () => {
    this.cardForm = new FormGroup({
      legal_name: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      zipcode: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      company: new FormControl(''),
      cardNumber: new FormControl('', [Validators.required, Validators.pattern(/^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)]),
      cardName: new FormControl('', Validators.required),
      cvv: new FormControl('', Validators.required),
      expirydate: new FormControl('', Validators.required)
    });
  }

  newCradFormInit = () => {
    this.newCard = new FormGroup({
      newLegalName: new FormControl('', Validators.required),
      newAddress: new FormControl('', Validators.required),
      newCity: new FormControl('', Validators.required),
      newZipcode: new FormControl('', Validators.required),
      newState: new FormControl('', Validators.required),
      newCountry: new FormControl('', Validators.required),
      newCompany: new FormControl(''),
      newCardNumber: new FormControl('', [Validators.required, Validators.pattern(/^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)]),
      newCardName: new FormControl('', Validators.required),
      newCvv: new FormControl('', Validators.required),
      newExpirydate: new FormControl('', Validators.required),
      defaultCard: new FormControl('')
    });
  }

  async creatorFeed(id) {
    return new Promise((pass, fail) => {
      this.commonservice.feed(id).subscribe(res => {
        pass(res);
      }, err => {
        fail(err);
      });
    });
  }

  // blur event of state textbox for counting tax
  taxCount(e) {

    this.commonservice.addTaxes(this.userID, this.cardForm.value.state, this.payType, this.taxID, { 'revenue_sharing': [] }).subscribe((taxes: any) => {
      this.isTaxShow = true;
      this.taxes = taxes;

      this.basicTotal = taxes.item_subtotal;
      this.finalTotal = taxes.total_payment;
      this.taxesAmount = taxes.card_transaction_fee + taxes.state_taxes + taxes.platform_fee_subscriber;
      // this.spinner.hide();
    })
  }

  onUpdate(data, temp) {
    this.spinner.show();
    this.tierID = data;
    if (this.tierID.tier_price === 0) {
      this.commonservice.freeSubscription(this.profileID).subscribe(res => {
        this.getSubscription(this.profileID);
        this.toastr.success('Subscribe for free.');
        this.commonservice.user_log({ message: 'User free subcribe successfully!' }).subscribe(res => { });
        this.spinner.hide()
        this.modalRef.hide();
        this.modalRef = null;
      }, err => {
        this.spinner.hide()
        this.modalRef.hide();
        this.modalRef = null;
        this.toastr.error(err.error.message);

      });
    } else {
      this.modalRef.hide();
      this.modalRef = null;

      this.payType = 'subscription_upgrade';
      this.payDescription = this.tierID.tier_name;
      this.payQuantity = this.tierID.tier_id;
      this.payAssetID = this.tierID.creator_id;
      this.perdayCostOld = this.currentSubscription.tier_price / 30;
      this.perdayCostNew = this.tierID.tier_price / 30;
      this.commonservice.getremainingDays.subscribe((days: any) => {
        this.remainingDays = days;
      });
      this.usedDays = 30 - this.remainingDays;
      if (this.remainingDays > 0) {
        this.netCost = ((this.perdayCostNew - this.perdayCostOld) * this.remainingDays) + (this.perdayCostNew * this.usedDays);
        if ((this.netCost - this.currentSubscription.tier_price) > 3) {
          this.payAmount = parseFloat(this.netCost.toFixed(2));
        } else {
          this.payAmount = this.tierID.tier_price;
          Swal.fire({
            title: 'Error',
            text: 'you are not eligible for price discount as you have used used subscription  above discount limit.',
            icon: 'error',
          });
        }
      } else {
        this.netCost = this.tierID.tier_price;
        this.payAmount = this.netCost;
      }
      this.isUpgrade = true;
      this.commonservice.getCardDetail().subscribe((res: any) => {
        if (res.profile.paymentProfiles) {
          this.customerProfileID = res.profile.customerProfileId;

          res.profile.paymentProfiles.forEach(e => {
            this.savedCard.push({
              cardNumber: e.payment.creditCard.cardNumber.split('X').pop(),
              paymentProfileID: e.customerPaymentProfileId,
              type: e.payment.creditCard.cardType,
              show: true
            })
          })
          this.isCardDetails = true;
          this.modalRef = this.modalService.show(temp, { class: 'CardDetailsPopup modal-lg' });
          this.spinner.hide();

        }
        else {
          this.showSpinner = false;
          this.isCardDetails = false;
          this.modalRef.hide();
          this.modalRef = null;
          this.formInit();
          this.modalRef = this.modalService.show(temp, { class: ' CardDetailsPopup modal-lg' });
          this.spinner.hide();
        }
      }, err => {
        this.formInit();
        this.showSpinner = false;
        this.isCardDetails = false;
        // this.modalRef.hide();
        // this.modalRef = null;
        this.modalRef = this.modalService.show(temp, { class: 'CardDetailsPopup modal-lg' });
        this.spinner.hide();
      });

    }

  }

  displayForm() {
    this.showCard = true;
    this.newCradFormInit();
  }

  freeSubscription() {
    this.commonservice.getProfileID.subscribe(res1 => {
      this.commonservice.freeSubscription(res1).subscribe(res => {
        this.toastr.success('Subscribe for free.');
        this.commonservice.user_log({ message: 'User free subcribe successfully!' }).subscribe(res => { });
        this.modalRef.hide();
        this.modalRef = null;
      }, err => {
        this.toastr.error(err.error.message);
      });
    });
  }


  AddComment(key, id, cmt) {
    this.spinner.show();
    if (key === 'modify') {
      let obj = {
        comment_uid: cmt,
        comment: this.comment
      }
      this.commonservice.update_comment(obj).subscribe(res => {
        this.commonservice.get_comments_post(id.post_id, 0, 5).subscribe((res: any) => {

          if (res.length > 0) {
            id.total_comments = res.length;
            id.commentArr = res;
            id.commentArr.forEach(ele => {

              ele.isModify = false;
              ele.isDelete = false;
              ele.isLike = false;
              this.onDownloadMedia(ele.profile[0].profile_picture).then(image => {
                ele.profile[0].profile_picture = image;
              });
              let dt = this.commonservice.scheduleDate(ele.created_date);
              let dt1 = this.commonservice.scheduleTime(ele.created_date);
              let dt2 = dt + ' ' + dt1;
              const date = moment(dt2, 'YYYY-MM-DD hh:mm:ss ').format('MMM Do  HH:MMA');
              ele.created_date = date;
              ele.replaytoComment = false;

              if (ele.total_replays > 0) {
                this.commonservice.get_reply(ele.comment_uid, 0, 5).subscribe(res => {
                  ele.reply = res;
                  ele.reply.forEach(e => {
                    let dt = this.commonservice.scheduleDate(e.created_date);
                    let dt1 = this.commonservice.scheduleTime(e.created_date);
                    let dt2 = dt + ' ' + dt1;
                    const date = moment(dt2, 'YYYY-MM-DD hh:mm:ss ').format('MMM Do  HH:MMA');
                    e.created_date = date;
                    e.isModify = false;
                    e.isDelete = false;
                    this.onDownloadMedia(e.profile[0].profile_picture).then(image => {
                      e.profile[0].profile_picture = image;
                    })
                  });
                });
              }
            });

          }
        });
        this.toastr.success('Comment updated  successfully.');
        this.commentArr.isModify = false;
        this.commentArr.comment = this.comment;
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.message);
      });
    } else if (key === 'comment') {
      let obj = {
        post_id: id.post_id,
        comment: this.comment
      }
      this.NotificationID = id;
      this.commonservice.comment(obj).subscribe(res => {
        this.commonservice.get_comments_post(id.post_id, 0, 5).subscribe((res: any) => {

          if (res.length > 0) {
            id.total_comments = res.length;
            id.commentArr = res;
            id.commentArr.forEach(ele => {

              ele.isModify = false;
              ele.isDelete = false;
              ele.isLike = false;
              this.onDownloadMedia(ele.profile[0].profile_picture).then(image => {
                ele.profile[0].profile_picture = image;
              });
              let dt = this.commonservice.scheduleDate(ele.created_date);
              let dt1 = this.commonservice.scheduleTime(ele.created_date);
              let dt2 = dt + ' ' + dt1;
              const date = moment(dt2, 'YYYY-MM-DD hh:mm:ss ').format('MMM Do  HH:MMA');
              ele.created_date = date;
              ele.replaytoComment = false;

              if (ele.total_replays > 0) {
                this.commonservice.get_reply(ele.comment_uid, 0, 5).subscribe(res => {
                  ele.reply = res;
                  ele.reply.forEach(e => {
                    let dt = this.commonservice.scheduleDate(e.created_date);
                    let dt1 = this.commonservice.scheduleTime(e.created_date);
                    let dt2 = dt + ' ' + dt1;
                    const date = moment(dt2, 'YYYY-MM-DD hh:mm:ss ').format('MMM Do  HH:MMA');
                    e.created_date = date;
                    e.isModify = false;
                    e.isDelete = false;
                    this.onDownloadMedia(e.profile[0].profile_picture).then(image => {
                      e.profile[0].profile_picture = image;
                    })
                  });
                });
              }
            });

          }
        });
        let obj = {
          event_type: 'NEW_COMMENT',
          user_id: this.userID,
          message: 'New comment from ' + this.subscriberUsername + '.',
          hyperlink: "/post/" + this.NotificationID,
          from_info: {
            display_name: this.subscriberName,
            profile_url: this.subscriberUsername,
            user_id: this.subscriberUserID
          }

        }
        this.commonservice.creator_notification(obj).subscribe((res: any) => { })
        this.toastr.success('Commented successfully.');
        this.spinner.hide();
        this.commonservice.user_log({ message: 'User commneted post successfully!' }).subscribe(res => { });
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.message);
      });
    } else if (key === 'reply') {
      let obj = {
        post_id: this.commentID.post_id,
        comment: this.comment
      }


      this.commonservice.reply_comment(this.commentID.comment_uid, obj).subscribe(res => {

        this.commonservice.get_comments_post(id.post_id, 0, 5).subscribe((res: any) => {

          if (res.length > 0) {
            id.total_comments = res.length;
            id.commentArr = res;
            id.commentArr.forEach(ele => {

              ele.isModify = false;
              ele.isDelete = false;
              ele.isLike = false;
              this.onDownloadMedia(ele.profile[0].profile_picture).then(image => {
                ele.profile[0].profile_picture = image;
              });
              let dt = this.commonservice.scheduleDate(ele.created_date);
              let dt1 = this.commonservice.scheduleTime(ele.created_date);
              let dt2 = dt + ' ' + dt1;
              const date = moment(dt2, 'YYYY-MM-DD hh:mm:ss ').format('MMM Do  HH:MMA');
              ele.created_date = date;
              ele.replaytoComment = false;

              if (ele.total_replays > 0) {
                this.commonservice.get_reply(ele.comment_uid, 0, 5).subscribe(res => {
                  ele.reply = res;
                  ele.reply.forEach(e => {
                    let dt = this.commonservice.scheduleDate(e.created_date);
                    let dt1 = this.commonservice.scheduleTime(e.created_date);
                    let dt2 = dt + ' ' + dt1;
                    const date = moment(dt2, 'YYYY-MM-DD hh:mm:ss ').format('MMM Do  HH:MMA');
                    e.created_date = date;
                    e.isModify = false;
                    e.isDelete = false;
                    this.onDownloadMedia(e.profile[0].profile_picture).then(image => {
                      e.profile[0].profile_picture = image;
                    })
                  });
                });
              }
            });

          }
        });
        this.NotificationID = id.post_id;

        let obj = {
          event_type: 'New comment reply',
          user_id: this.userID,
          message: 'Reply from ' + this.subscriberUsername + ' on your comment.',
          hyperlink: "/post/" + this.NotificationID,
          from_info: {
            display_name: this.subscriberName,
            profile_url: this.subscriberUsername,
            user_id: this.subscriberUserID
          }

        }



        this.commonservice.creator_notification(obj).subscribe((res: any) => { })
        // this.feed();


        this.toastr.success('Reply sent successfully.');
        this.commonservice.user_log({ message: 'Userreply to comment successfully!' }).subscribe(res => { });
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.message);
      });
    }

  }

  updateComment(arr) {
    this.commentArr = arr;
    arr.isModify = true;
  }

  open(temp, arr) {
    this.modalRef = this.modalService.show(temp, { class: 'MediaPopup modal-lg' });
    this.mediaImages = arr;
    this.postId = arr.post_id;
  }


  onComment(e) {
    this.comment = e.target.value;
  }

  showComment(post) {
    if (this.isActive) {
      post.showCommentBox = true;
    } else {
      this.toastr.warning('You must subscribe to do that. XXOO');
    }
  }

  Voting(vote, id) {
    if (this.isActive) {
      this.spinner.show();
      if (vote === '10') {
        let obj = {
          post_id: id.post_id,
          vote: 'ten'
        }
        this.commonservice.voting(obj).subscribe(res => {
          this.toastr.success('Voted successfully.');
          this.commonservice.user_log({ message: 'You rated this post.' }).subscribe(res => { });
          this.commonservice.get_post_id(id.post_id).subscribe((post: any) => {
            this.commonservice.getAllVotes(id.post_id).subscribe((vote: any) => {
              id.votes = [];
              id.votes.push(vote);
              if ((vote.ten + vote.nine + vote.eight + vote.seven + vote.six) > 0) {
                id.totalVotes = vote.ten + vote.nine + vote.eight + vote.seven + vote.six;
              } else {
                id.totalVotes = 0;
              }


              if (post.score >= 95 && id.totalVotes > 0) {
                id.is100 = true;
              }
              if (post.score >= 90 && post.score <= 95) {
                id.is90 = true;
              }
              if (post.score >= 70 && post.score <= 89) {
                id.is80 = true;
              }
              if (post.score >= 46 && post.score <= 69) {
                id.is70 = true;
              }
              if (post.score <= 45) {
                id.is60 = true;
              }
            })
          })
          this.spinner.hide();
        }, err => {
          this.spinner.hide();
          this.toastr.error(err.error.message);
        });
      }
      if (vote === '9') {

        let obj = {
          post_id: id.post_id,
          vote: 'nine'
        }
        this.commonservice.voting(obj).subscribe(res => {
          this.toastr.success('Voted successfully.');
          this.commonservice.user_log({ message: 'You rated this post.' }).subscribe(res => { });
          this.commonservice.get_post_id(id.post_id).subscribe((post: any) => {
            this.commonservice.getAllVotes(id.post_id).subscribe((vote: any) => {
              id.votes = [];
              id.votes.push(vote);
              if ((vote.ten + vote.nine + vote.eight + vote.seven + vote.six) > 0) {
                id.totalVotes = vote.ten + vote.nine + vote.eight + vote.seven + vote.six;
              } else {
                id.totalVotes = 0;
              }


              if (post.score >= 95 && id.totalVotes > 0) {
                id.is100 = true;
              }
              if (post.score >= 90 && post.score <= 95) {
                id.is90 = true;
              }
              if (post.score >= 70 && post.score <= 89) {
                id.is80 = true;
              }
              if (post.score >= 46 && post.score <= 69) {
                id.is70 = true;
              }
              if (post.score <= 45) {
                id.is60 = true;
              }
            })
          })
          this.spinner.hide();

        }, err => {
          this.spinner.hide();
          this.toastr.error(err.error.message);
        })
      }
      if (vote === '8') {

        let obj = {
          post_id: id.post_id,
          vote: 'eight'
        }
        this.commonservice.voting(obj).subscribe(res => {
          this.toastr.success('Voted successfully.');
          this.commonservice.user_log({ message: 'You rated this post.' }).subscribe(res => { });
          this.commonservice.get_post_id(id.post_id).subscribe((post: any) => {
            this.commonservice.getAllVotes(id.post_id).subscribe((vote: any) => {
              id.votes = [];
              id.votes.push(vote);
              if ((vote.ten + vote.nine + vote.eight + vote.seven + vote.six) > 0) {
                id.totalVotes = vote.ten + vote.nine + vote.eight + vote.seven + vote.six;
              } else {
                id.totalVotes = 0;
              }


              if (post.score >= 95 && id.totalVotes > 0) {
                id.is100 = true;
              }
              if (post.score >= 90 && post.score <= 95) {
                id.is90 = true;
              }
              if (post.score >= 70 && post.score <= 89) {
                id.is80 = true;
              }
              if (post.score >= 46 && post.score <= 69) {
                id.is70 = true;
              }
              if (post.score <= 45) {
                id.is60 = true;
              }
            })
          })
          this.spinner.hide();

        }, err => {
          this.spinner.hide();
          this.toastr.error(err.error.message);
        })
      }
      if (vote === '7') {

        let obj = {
          post_id: id.post_id,
          vote: 'seven'
        }
        this.commonservice.voting(obj).subscribe(res => {
          this.toastr.success('Voted successfully.');
          this.commonservice.user_log({ message: 'You rated this post.' }).subscribe(res => { });
          this.commonservice.get_post_id(id.post_id).subscribe((post: any) => {
            this.commonservice.getAllVotes(id.post_id).subscribe((vote: any) => {
              id.votes = [];
              id.votes.push(vote);
              if ((vote.ten + vote.nine + vote.eight + vote.seven + vote.six) > 0) {
                id.totalVotes = vote.ten + vote.nine + vote.eight + vote.seven + vote.six;
              } else {
                id.totalVotes = 0;
              }


              if (post.score >= 95 && id.totalVotes > 0) {
                id.is100 = true;
              }
              if (post.score >= 90 && post.score <= 95) {
                id.is90 = true;
              }
              if (post.score >= 70 && post.score <= 89) {
                id.is80 = true;
              }
              if (post.score >= 46 && post.score <= 69) {
                id.is70 = true;
              }
              if (post.score <= 45) {
                id.is60 = true;
              }
            })
          })
          this.spinner.hide();

        }, err => {
          this.spinner.hide();
          this.toastr.error(err.error.message);
        })
      }
      if (vote === '6') {

        let obj = {
          post_id: id.post_id,
          vote: 'six'
        }
        this.commonservice.voting(obj).subscribe(res => {
          this.toastr.success('Voted successfully.');
          this.commonservice.user_log({ message: 'You rated this post.' }).subscribe(res => { });
          this.commonservice.get_post_id(id.post_id).subscribe((post: any) => {
            this.commonservice.getAllVotes(id.post_id).subscribe((vote: any) => {
              id.votes = [];
              id.votes.push(vote);
              if ((vote.ten + vote.nine + vote.eight + vote.seven + vote.six) > 0) {
                id.totalVotes = vote.ten + vote.nine + vote.eight + vote.seven + vote.six;
              } else {
                id.totalVotes = 0;
              }


              if (post.score >= 95 && id.totalVotes > 0) {
                id.is100 = true;
              }
              if (post.score >= 90 && post.score <= 95) {
                id.is90 = true;
              }
              if (post.score >= 70 && post.score <= 89) {
                id.is80 = true;
              }
              if (post.score >= 46 && post.score <= 69) {
                id.is70 = true;
              }
              if (post.score <= 45) {
                id.is60 = true;
              }
            })
          })
          this.spinner.hide();

        }, err => {
          this.spinner.hide();
          this.toastr.error(err.error.message);
        });
      }
    } else {
      this.toastr.warning('You must subscribe to do that.', 'Warning!', { timeOut: 3000 })
    }


  }

  deleteComment(key, arr, replyArr) {
    // this.spinner.show();
    this.confirmationService.confirm({
      message: 'Are you sure  you want to Delete?',
      accept: () => {

        if (key === 'comment') {
          this.commonservice.delete_comments(arr.comment_uid, 0, 5).subscribe(res => {
            this.feed();
            this.toastr.success('Comment Deleted Successfully!');
            this.commonservice.user_log({ message: 'User deleted commnent successfully!' }).subscribe(res => { });
            this.spinner.hide();
          }, err => {
            this.spinner.hide();
            this.toastr.error(err.error.message);
          })
        } else if (key === 'reply') {
          this.commonservice.delete_reply(arr.comment_uid, replyArr.comment_uid).subscribe(res => {
            this.feed();
            replyArr.isDelete = true;
            this.toastr.success('Reply Deleted Successfully!');
            this.commonservice.user_log({ message: 'User deleted reply successfully!' }).subscribe(res => { });
            this.spinner.hide();
          }, err => {
            this.spinner.hide();
            this.toastr.error(err.error.message);
          })
        }
      }
    });
  }

  close() {
    this.modalRef.hide();
    this.modalRef = null;
    if (this.showCard === true) {
      this.showCard = false;
      this.newCard.reset();
    }
    this.subscribeData = [];
    this.submitted = false;
    this.contributionValue = [];
    this.contributionsList = [];
    this.savedCard = [];
  }

  openPurchase(data, temp) {
    this.tierID = data;
    if (this.tierID.tier_price === 0) {
      this.commonservice.freeSubscription(this.profileID).subscribe(res => {
        this.getSubscription(this.profileID);
        this.toastr.success('Subscribe for free.');
        this.commonservice.user_log({ message: 'User free subcribe successfully!' }).subscribe(res => { });
        this.modalRef.hide();
        this.modalRef = null;
      }, err => {
        this.modalRef.hide();
        this.modalRef = null;
        this.toastr.error(err.error.message);

      });
    } else {
      this.spinner.show();
      this.modalRef.hide();
      this.modalRef = null;


      this.payType = 'subscription';
      this.payDescription = this.tierID.tier_name;
      this.payQuantity = this.tierID.tier_id;
      this.payAssetID = this.tierID.creator_id;
      this.payAmount = parseFloat(this.tierID.tier_price);
      this.commonservice.getCardDetail().subscribe((res: any) => {
        this.state = res.profile.shipToList[0].state;
        this.commonservice.addTaxes(this.userID, res.profile.shipToList[0].state, this.payType, this.payAmount, { 'revenue_sharing': [] }).subscribe((taxes: any) => {
          this.taxes = taxes;
          this.basicTotal = taxes.item_subtotal;
          this.finalTotal = taxes.total_payment;
          this.taxesAmount = taxes.card_transaction_fee + taxes.state_taxes + taxes.platform_fee_subscriber;
          this.spinner.hide();
        })
        if (res.profile.paymentProfiles) {
          this.customerProfileID = res.profile.customerProfileId;

          res.profile.paymentProfiles.forEach(e => {
            this.savedCard.push({
              cardNumber: e.payment.creditCard.cardNumber.split('X').pop(),
              paymentProfileID: e.customerPaymentProfileId,
              type: e.payment.creditCard.cardType,
              show: true
            })
          })
          this.isCardDetails = true;
          this.modalRef = this.modalService.show(temp, { class: 'CardDetailsPopup modal-lg' });
          this.spinner.hide();
        } else {
          // this.modalRef.hide();
          // this.modalRef = null;
          this.isCardDetails = false;
          this.formInit();
          this.modalRef = this.modalService.show(temp, { class: 'CardDetailsPopup modal-lg' });
          this.spinner.hide();
        }
      }, err => {
        this.formInit();
        this.isCardDetails = false;
        this.modalRef = this.modalService.show(temp, { class: 'CardDetailsPopup modal-lg' });
        this.spinner.hide();
      });
    }


  }

  onSubscribe(temp) {
    this.spinner.show();
    this.subscribeData = [];
    this.commonservice.get_subscribe(this.userID).subscribe((res: any) => {

      res.tiers.forEach(e => {

        if (this.isEdit) {
          if (e.tier_enabled === true && e.tier_price > 0) {
            this.subscribeData.push(e);

          } else {

          }
        } else {
          if (e.tier_enabled === true) {
            this.subscribeData.push(e);

          } else {

          }
        }

      });


      if (this.subscribeData.length > 0) {
        this.modalRef = this.modalService.show(temp, { class: 'SubscribePopup modal-lg' });
        this.spinner.hide();
      }

      if (this.subscribeData.length === 0) {
        this.spinner.hide();
        this.toastr.error('@' + this.userName + ' has disabled any new subscriptions.');
        this.notShow = true;
      }


    }, err => {
      this.spinner.hide();
      this.toastr.error('@' + this.userName + ' has disabled any new subscriptions.');
      this.notShow = true;
    });
  }

  onTips(temp, key, arr) {
    this.modalRef = this.modalService.show(temp, { class: 'PopupProfileWrap' });
    this.tipType = key;
    this.commentID = arr;
  }

  onTip(key, temp) {

    if (this.tipAmount > 0) {
      this.spinner.show();
      this.showSpinner = true;
      this.payType = key;
      this.payDescription = 'Tip';
      this.payAmount = this.tipAmount;
      if (this.tipType === 'Tips') {
        this.payAssetID = this.userID;
      } else {
        this.payAssetID = this.commentID.comment_uid;
        this.NotificationID = this.commentID.post_id;
      }
      this.payQuantity = 1;
      this.commonservice.getCardDetail().subscribe((res: any) => {
        if (res.profile.paymentProfiles) {
          this.showSpinner = false;
          this.customerProfileID = res.profile.customerProfileId;
          res.profile.paymentProfiles.forEach(e => {
            this.savedCard.push({
              cardNumber: e.payment.creditCard.cardNumber.split('X').pop(),
              paymentProfileID: e.customerPaymentProfileId,
              type: e.payment.creditCard.cardType,
              show: true
            });
          });
          this.isCardDetails = true;
          this.modalRef.hide();
          this.modalRef = null;
          this.modalRef = this.modalService.show(temp, { class: ' CardDetailsPopup modal-lg' });
        } else {
          this.showSpinner = false;
          this.isCardDetails = false;
          this.modalRef.hide();
          this.modalRef = null;
          this.formInit();
          this.modalRef = this.modalService.show(temp, { class: ' CardDetailsPopup modal-lg' });
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        this.modalRef.hide();
        this.modalRef = null;
        this.showSpinner = false;
        this.modalRef = this.modalService.show(temp, { class: 'CardDetailsPopup modal-lg' });
        this.isCardDetails = false;
        this.formInit();
        this.toastr.error(err.error.message);
      });

    } else {
      this.isTipValue = true;
    }

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

  plus() {
    this.quantity++;
    this.remainingQuantity--;
    this.productCost = this.quantity * this.originalCost;
    this.commonservice.addTaxes(this.userID, this.state, this.payType, this.productCost, { 'revenue_sharing': [] }).subscribe((taxes: any) => {
      this.taxes = taxes;
      this.basicTotal = taxes.item_subtotal;
      this.finalTotal = taxes.total_payment;
      this.taxesAmount = taxes.card_transaction_fee + taxes.state_taxes + taxes.platform_fee_subscriber;
    });
    if (this.remainingQuantity > 1) {
      this.isAvailQuantity = false;
    } else {
      this.isAvailQuantity = true;
    }
  }

  minus() {
    if (this.quantity > 1) {
      this.quantity--;
      this.remainingQuantity++;
      this.productCost = this.quantity * this.originalCost;
      this.commonservice.addTaxes(this.userID, this.state, this.payType, this.productCost, { 'revenue_sharing': [] }).subscribe((taxes: any) => {
        this.taxes = taxes;
        this.basicTotal = taxes.item_subtotal;
        this.finalTotal = taxes.total_payment;
        this.taxesAmount = taxes.card_transaction_fee + taxes.state_taxes + taxes.platform_fee_subscriber;
      });
      if (this.remainingQuantity > 1) {
        this.isAvailQuantity = false;
      } else {
        this.isAvailQuantity = true;
      }
    }
  }

  Buy(key, arr, temp) {
    this.spinner.show();
    this.contributionValue = [];
    this.contributionsList = [];
    this.savedCard = [];
    if (key === 'pack') {
      this.isPackPurchase = true;
      this.isProductPurchase = false;
      this.isExclusivePurchase = false;
      this.packCost = arr.price;
      this.title = arr.title;
      this.button = 'Purchase';

      this.payType = key;
      this.payDescription = arr.description;
      this.payAssetID = arr.pack_id;
      this.payQuantity = 1;
      this.payAmount = arr.price;
      this.taxID = arr.price;
    }
    if (key === 'product') {
      this.isPackPurchase = false;
      this.isProductPurchase = true;
      this.isExclusivePurchase = false;
      this.title = arr.product_name;
      this.quantity = 1;
      this.remainingQuantity = arr.quantity_available;
      this.originalQty = arr.quantity_available;
      if (this.remainingQuantity > 1) {
        this.isAvailQuantity = false;
      } else {
        this.isAvailQuantity = true;
      }
      this.productCost = arr.price;
      this.originalCost = arr.price;
      this.button = 'Purchase';

      if (arr.info_needed_for_delivery !== '') {
        this.infoRequired = arr.info_needed_for_delivery;
      }

      this.taxID = arr.price;
      this.payType = key;
      this.payDescription = arr.product_description;
      this.payAssetID = arr.product_id;

    }

    if (key === 'exclusive') {
      this.isPackPurchase = false;
      this.isProductPurchase = false;
      this.isExclusivePurchase = true;
      this.title = arr.title;
      this.button = 'Contribute';
      this.exclusiveID = arr.exclusive_id;
      this.payType = key;
      this.payDescription = 'contribution';
      this.payAssetID = arr.exclusive_id;
      this.payQuantity = 1;
      let goal = arr.goal
      let l1 = arr.min_contribution;
      let l2 = arr.min_contribution;
      for (let i = 0; i <= 5; i++) {
        this.contributionValue.push(l2);
        l2 = l2 + l1;
      }
      this.contributionValue.forEach(e => {
        if (e < goal) {

          this.contributionsList.push({ label: e, value: e });
        }
      });
      this.taxID = arr.price;
    }

    this.commonservice.getCardDetail().subscribe((res: any) => {
      this.state = res.profile.shipToList[0].state;
      this.commonservice.addTaxes(this.userID, res.profile.shipToList[0].state, key, this.taxID, { 'revenue_sharing': [] }).subscribe((taxes: any) => {
        this.taxes = taxes;
        this.basicTotal = taxes.item_subtotal;
        this.finalTotal = taxes.total_payment;
        this.taxesAmount = taxes.card_transaction_fee + taxes.state_taxes + taxes.platform_fee_subscriber;
        this.spinner.hide();
      });
      if (res.profile.paymentProfiles) {
        this.newCradFormInit();
        this.customerProfileID = res.profile.customerProfileId;
        res.profile.paymentProfiles.forEach(e => {
          this.savedCard.push({
            cardNumber: e.payment.creditCard.cardNumber.split('X').pop(),
            paymentProfileID: e.customerPaymentProfileId,
            type: e.payment.creditCard.cardType,
            show: true
          });
        });
        this.isCardDetails = true;
        this.modalRef = this.modalService.show(temp, { class: 'CardDetailsPopup modal-lg' });
        this.spinner.hide();
      } else {
        this.showSpinner = false;
        this.isCardDetails = false;
        // this.modalRef.hide();
        // this.modalRef = null;
        this.formInit();
        this.modalRef = this.modalService.show(temp, { class: ' CardDetailsPopup modal-lg' });
        this.spinner.show();
      }
    }, err => {
      // this.modalRef.hide();
      // this.modalRef = null;
      this.showSpinner = false;
      this.modalRef = this.modalService.show(temp, { class: 'CardDetailsPopup modal-lg' });
      this.spinner.hide();
      this.formInit();
      this.isCardDetails = false;
      this.toastr.error(err.error.message);
    });

  }

  ngOnInit() {
  }

}
