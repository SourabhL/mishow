import { Component, OnInit, TemplateRef } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import * as moment from 'moment';
import { ConfirmationService } from 'primeng/api';
@Component({
  selector: 'app-view-media',
  templateUrl: './view-media.component.html',
  styleUrls: ['./view-media.component.css']
})
export class ViewMediaComponent implements OnInit {
  data: any = [];
  packData: any = [];
  comments: any = [];
  vote: any = [];
  profile: any = [];
  media: any = [];
  comment: any;
  showSpinner = false;
  showCommentBox = false;
  subscriberImage: any;
  subscriberName: any;
  isVote10 = false;
  isVote9 = false;
  isVote8 = false;
  isVote7 = false;
  isVote6 = false;

  isPost = false;
  isPack = false;
  isProduct = false;
  isExclusive = false;
  isActive = false;
  isComments = false;
  isValue = false;
  contribution = 0;
  modalRef: BsModalRef;
  start = 0;
  limit = 5;
  payType: any;
  payDescription: any;
  payAmount: any;
  payAssetID: any;
  payQuantity: any;
  userID: any;
  userId: any;
  isCardDetails = false;
  cardNumber: any;
  customerProfileID: any;
  paymentProfileID: any;
  cardForm: FormGroup;
  newCard: FormGroup;
  submitted = false;
  exclusiveID: any;
  commentID: any = [];
  NotificationID: any;
  countryList = [
    { label: 'Select any one', value: '' },
    { label: 'India', value: 'india' },
    { label: 'USA', value: 'us' }
  ]
  constructor(

    private commonservice: CommonService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private confirmationservice: ConfirmationService,
    private router: Router
  ) {
    this.spinner.show();

    if (this.route.snapshot.params.type === 'post') {
      this.getPost(this.route.snapshot.params.id)
    }

    if (this.route.snapshot.params.type === 'pack') {
      this.isPack = true;
      this.commonservice.get_pack_id(this.route.snapshot.params.id).subscribe((res: any) => {
        this.data = res;
        console.log('this.packData=>', this.packData);
        this.media = {
          image: [],
          video: []
        };
        const isImages = ['jpg', 'jpeg', 'png', 'webp'];
        const isVideo = ['mp4'];

        this.data.preview_media.forEach(e => {
          const imgStr = isImages.join(',');
          const videoStr = isVideo.join(',');
          if (imgStr.includes(e.split('.').pop()) === true) {
            this.onDownloadMedia(e).then(res => {
              this.onDownloadMedia(e).then(res => {
                this.media.image.push(res);
              })
            })
          } else {
            this.onDownloadMedia(e).then(res => {
              this.media.video.push(res);
            })
          }
        });
      });

    }


    if (this.route.snapshot.params.type === 'product') {
      this.isProduct = true;
      this.commonservice.get_product_id(this.route.snapshot.params.id).subscribe((res: any) => {
        this.data = res;
        this.media = {
          image: [],
          video: []
        };
        const isImages = ['jpg', 'jpeg', 'png', 'webp'];
        const isVideo = ['mp4'];

        this.data.product_image.forEach(e => {
          const imgStr = isImages.join(',');
          const videoStr = isVideo.join(',');
          if (imgStr.includes(e.split('.').pop()) === true) {
            this.onDownloadMedia(e).then(res => {
              this.media.image.push(res);
            })
          } else {
            this.onDownloadMedia(e).then(res => {
              this.media.video.push(res);
            })
          }
        });
      });

    }

    if (this.route.snapshot.params.type === 'exclusive') {
      this.isExclusive = true;
      this.commonservice.get_exclusive_id(this.route.snapshot.params.id).subscribe((res: any) => {
        this.data = res;
        this.media = {
          image: [],
          video: []
        };
        const isImages = ['jpg', 'jpeg', 'png', 'webp'];
        const isVideo = ['mp4'];


        if (this.data.available_now === true) {
          this.data.exclusive_content.forEach(e => {
            const imgStr = isImages.join(',');
            const videoStr = isVideo.join(',');
            if (imgStr.includes(e.split('.').pop()) === true) {
              this.onDownloadMedia(e).then(res => {
                this.media.image.push(res);
              })
            } else {
              this.onDownloadMedia(e).then(res => {
                this.media.video.push(res);
              })
            }
          });
        } else {
          this.data.media.forEach(e => {
            const imgStr = isImages.join(',');
            const videoStr = isVideo.join(',');
            if (imgStr.includes(e.split('.').pop()) === true) {
              this.onDownloadMedia(e).then(res => {
                this.media.image.push(res);
              })
            } else {
              this.onDownloadMedia(e).then(res => {
                this.media.video.push(res);
              })
            }
          });
        }

      });

    }

    this.commonservice.viewProfile(this.route.snapshot.params.profileurl).subscribe((res: any) => {

      // this.profile = res;
      // this.userID = res.user_id;
    });

    this.commonservice.get_profile().subscribe((res: any) => {
      this.onDownloadMedia(res.profile_picture).then(image => {
        res.profile_picture = image;
      })
      this.profile = res;
      this.userID = res.user_id;
      // this.subscriberName = res.display_name;
      // this.subscriberImage = res.profile_picture;
      // this.commonservice.checkSubscription(res.profile_id).subscribe((res: any) => {
      //   if (res.subscription_status === 'ACTIVE' || res.subscription_status === 'NEW') {
      //     this.isActive = true;
      //   }
      // });
    });
    this.spinner.hide();
  }

  getPost(id) {
    this.commonservice.get_post_id(id).subscribe((res: any) => {
      this.data = res;
      // new
      if (this.data.length > 0) {
        this.data.tag = true;
      }
      if (this.data.media) {
        this.media = {

          image: [],
          video: []
        };
        const isImages = ['jpg', 'jpeg', 'png', 'webp'];
        const isVideo = ['mp4'];
        this.data.media.forEach(e => {
          const imgStr = isImages.join(',');
          const videoStr = isVideo.join(',');
          if (imgStr.includes(e.split('.').pop()) === true) {

            this.onDownloadMedia(e).then(res => {
              this.media.image.push(res);
            })
          } else {

            this.onDownloadMedia(e).then(res => {
              this.media.video.push(res);
            })
          }
        });
      }


      let dt1 = this.commonservice.scheduleDate(this.data.publish_date);
      this.data.publish_date = moment(dt1, 'YYYY-MM-DD').format('MMM DD');

      this.commonservice.getAllVotes(res.post_id).subscribe(res => {
        this.vote = res;
        if ((this.vote.ten + this.vote.nine + this.vote.eight + this.vote.seven + this.vote.six) > 0) {
          this.data.totalVotes = this.vote.ten + this.vote.nine + this.vote.eight + this.vote.seven + this.vote.six;
        } else {
          this.data.totalVotes = 0;
        }


        if (this.data.score >= 100 && this.data.totalVotes > 0) {
          this.data.is100 = true;
        }
        if (this.data.score >= 90 && this.data.score <= 90) {
          this.data.is90 = true;
        }
        if (this.data.score >= 89 && this.data.score <= 80) {
          this.data.is80 = true;
        }
        if (this.data.score >= 79 && this.data.score <= 70) {
          this.data.is70 = true;
        }
        if (this.data.score <= 60) {
          this.data.is60 = true;
        }

      });

      if (this.data.total_comments > 0) {
        this.commonservice.get_comments_post(res.post_id, this.start, this.limit).subscribe((res: any) => {

          if (res.length > 0) {
            this.data.commentArr = res;
            this.data.commentArr.forEach(ele => {
              ele.isModify = false;
              ele.isDelete = false;
              ele.isLike = false;

              let dt = this.commonservice.scheduleDate(ele.created_date);
              let dt1 = this.commonservice.scheduleTime(ele.created_date);
              let dt2 = dt + ' ' + dt1;
              const date = moment(dt2, 'YYYY-MM-DD hh:mm:ss ').format('MMM Do  HH:MMA');
              ele.created_date = date;
              ele.replaytoComment = false;
              this.onDownloadMedia(ele.profile[0].profile_picture).then(image => {
                ele.profile[0].profile_picture = image;
              });
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
                    });
                  });


                });
              }
            });

          }
        });
      }

      this.isPost = true;
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

  onContribute(temp, id) {
    this.exclusiveID = id;
    this.openModal(temp);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    // this.modalRef.setClass('modal-md');
  }

  onContributionSubmit(key, temp) {

    if (this.contribution > 0) {
      this.payType = key;
      this.payDescription = 'contribution';
      this.payAmount = this.contribution;
      this.payAssetID = this.exclusiveID;
      this.payQuantity = 1;
      this.commonservice.getCardDetail().subscribe((res: any) => {
        if (res) {
          this.newCradFormInit();
          this.paymentProfileID = res.profile.paymentProfiles[0].customerPaymentProfileId;
          this.customerProfileID = res.profile.customerProfileId;
          this.cardNumber = res.profile.paymentProfiles[0].payment.creditCard.cardNumber.split('X').pop();
          this.isCardDetails = true;
          this.modalRef.hide();
          this.modalRef = null;
          this.modalRef = this.modalService.show(temp, { class: 'modal-lg' });
        } else {
          this.formInit();
          this.isCardDetails = false;
          this.modalRef.hide();
          this.modalRef = null;
          this.modalRef = this.modalService.show(temp, { class: 'modal-lg' });
        }
      }, err => {
        this.modalRef.hide();
        this.modalRef = null;
        this.modalRef = this.modalService.show(temp, { class: 'modal-lg' });
        this.isCardDetails = false;
        this.toastr.error(err.error.message);
      });
    } else {
      this.isValue = true;
    }

  }

  onSubmit(valid) {
    this.submitted = true;
    if (valid) {
      this.showSpinner = true;
      let name = this.cardForm.value.legal_name.split(' ');
      let obj = {
        creator_id: this.userID,
        asset: {
          asset_id: this.payAssetID,
          creator_id: this.userID,
          quantity: this.payQuantity,
          type: this.payType,
          description: this.payDescription
        },
        payment_info: {
          amount: this.payAmount
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
      }
      this.commonservice.cardDeatil(obj).subscribe((res: any) => {
        this.showSpinner = false;
        this.toastr.success('Card Detail Added successfully');
        this.commonservice.user_log({ message: 'User added card details successfully!' }).subscribe(res => { });
        // this.commonservice.getProfileID.subscribe(res1 => {
        //   this.commonservice.subscribeWithPurchase(res1, this.tierID.tier_id, res.transId).subscribe(res => {
        //     this.toastr.success('Subscribe Successfully');
        //   }, err => {
        //     this.showSpinner = false;
        //     this.toastr.error(err.error.message);
        //   });
        // });
      }, err => {
        this.showSpinner = false;
        this.toastr.error(err.error.message);
      });
    } else {
      this.showSpinner = false;
    }
  }

  likeComment(arr) {
    this.spinner.show();
    this.commonservice.like_comment(arr.comment_uid).subscribe(res => {
      this.toastr.success('Like  the comment!');
      // this.NotificationID = arr.post_id;
      // let obj = {
      //   event_type: 'NEW_LIKE',
      //   user_id: this.userID,
      //   message: 'New like  from  ' + this.subscriberUsername,
      //   hyperlink: "mi.show/post/" + this.NotificationID,
      //   from_info: {
      //     display_name: this.subscriberName,
      //     profile_url: this.subscriberUsername,
      //     user_id: this.subscriberUserID
      //   }
      // }
      // this.commonservice.creator_notification(obj).subscribe((res: any) => { })
      arr.isLike = true;
      arr.total_likes = arr.total_likes + 1;
      arr.you_liked = true;
      this.commonservice.user_log({ message: 'User like the comment successfully!' }).subscribe(res => { });
      this.spinner.hide();
    }, err => {
      this.toastr.error(err.error.message);
      this.spinner.hide();
    });
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

  reply(arr) {
    this.commentID = arr;
    arr.replaytoComment = true;
  }

  card() {
    let obj = {
      creator_id: this.userID,
      asset: {
        asset_id: this.payAssetID,
        creator_id: this.userID,
        quantity: this.payQuantity,
        type: this.payType,
        description: this.payDescription
      },
      payment_info: {
        amount: this.payAmount
      },
      customerProfileId: this.customerProfileID,
      paymentProfileId: this.paymentProfileID
    }
    this.commonservice.cardDeatil(obj).subscribe((res: any) => {
      this.showSpinner = false;
      this.toastr.success('Card Detail Added successfully');
      this.commonservice.contribute({ exclusive_id: this.exclusiveID, contribution_amount: this.payAmount, transaction_id: res.transId }).subscribe(res => {
        this.toastr.success('Contributed Successfully');
        this.commonservice.user_log({ message: 'User contributed successfully!' }).subscribe(res => { });
        this.modalRef.hide();
        this.modalRef = null;
      }, err => {
        this.showSpinner = false;
        this.toastr.error(err.error.message);
      });
      // if (this.payType !== 'subscribe') {
      //   this.modalRef.hide();
      //   this.modalRef = null;
      // }

    }, err => {
      this.showSpinner = false;
      this.toastr.error(err.error.message);
    });

  }

  onNewcardSubmit(valid) {
    this.submitted = true;
    if (valid) {
      this.showSpinner = true;
      let name = this.newCard.value.newLegalName.split(' ');
      let obj = {
        customerProfileId: this.customerProfileID,
        asset: {
          asset_id: this.payAssetID,
          creator_id: this.userID,
          quantity: this.payQuantity,
          type: this.payType,
          description: this.payDescription
        },
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
          amount: this.payAmount
        },
        card_info: {
          cardNumber: this.newCard.value.newCardNumber,
          expirationDate: moment(this.newCard.value.newExpirydate).format('YYYY-MM'),
          cardCode: this.newCard.value.newCvv,
          cardHolderName: this.newCard.value.newCardName
        },
        setDefaultCard: false
      };
      this.commonservice.addNewDetails(obj).subscribe((res: any) => {
        this.showSpinner = false;
        this.toastr.success('Card Added successfully');
        this.commonservice.user_log({ message: 'User added new card successfully!' }).subscribe(res => { });

        this.commonservice.contribute({ exclusive_id: this.exclusiveID, contribution_amount: this.payAmount, transaction_id: res.transId }).subscribe(res => {
          this.toastr.success('Contributed Successfully');
          this.commonservice.user_log({ message: 'User contributed successfully!' }).subscribe(res => { });
          this.modalRef.hide();
          this.modalRef = null;
        }, err => {
          this.showSpinner = false;
          this.toastr.error(err.error.message);
        });
      }, err => {
        this.showSpinner = false;
        this.toastr.error(err.error.message);
      });
    }
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
      newExpirydate: new FormControl('', Validators.required)
    });
  }


  onComment(e) {
    this.comment = e.target.value;
  }

  showComment() {
    if (this.isActive) {
      this.showCommentBox = true;
    } else {
      this.toastr.warning('You are not subscribe to this creator , please subscribe first.', 'Warning!', { timeOut: 3000 })
    }
  }

  // new
  AddComment(key, arr, cmt) {
    this.spinner.show();
    if (key === 'modify') {
      let obj = {
        comment_uid: cmt,
        comment: this.comment
      }
      this.commonservice.update_comment(obj).subscribe(res => {
        this.commonservice.get_comments_post(arr.post_id, 0, 5).subscribe((res: any) => {

          if (res.length > 0) {
            this.data.total_comments = res.length;
            arr.commentArr = res;
            arr.commentArr.forEach(ele => {

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
        arr.isModify = false;
        arr.comment = this.comment;
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.message);
      });
    } else if (key === 'comment') {
      let obj = {
        post_id: arr.post_id,
        comment: this.comment
      }
      this.NotificationID = arr.post_id;
      this.commonservice.comment(obj).subscribe(res => {
        this.commonservice.get_comments_post(arr.post_id, 0, 5).subscribe((res: any) => {

          if (res.length > 0) {
            this.data.total_comments = res.length;
            arr.commentArr = res;
            arr.commentArr.forEach(ele => {

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


        this.toastr.success('Commented successfully.');
        this.spinner.hide();
        this.commonservice.user_log({ message: 'User commneted post successfully!' }).subscribe(res => { });
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.message);
      });
    } else if (key === 'reply') {


      let obj = {
        post_id: arr.post_id,
        comment: this.comment
      }
      this.commonservice.reply_comment(cmt.comment_uid, obj).subscribe(res => {

        this.commonservice.get_comments_post(arr.post_id, 0, 5).subscribe((res: any) => {

          if (res.length > 0) {
            this.data.total_comments = res.length;
            arr.commentArr = res;
            arr.commentArr.forEach(ele => {

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
        this.toastr.success('Replied to comment successfully!');
        this.commonservice.user_log({ message: 'Userreply to comment successfully!' }).subscribe(res => { });
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.message);
      });
    }
  }

  // function for load comments
  LoadComments(arr) {
    if (arr.total_comments > 0) {
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
            this.onDownloadMedia(ele.profile[0].profile_picture).then(image => {
              ele.profile[0].profile_picture = image;
            });
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
                  });
                });


              });
            }
          });

        }
      });
    }
  }

  updateComment(arr) {
    // this.commentArr = arr;
    arr.isModify = true;
  }

  Voting(vote, id) {

    this.spinner.show();
    if (vote === '10') {
      let obj = {
        post_id: id,
        vote: 'ten'
      }
      this.commonservice.voting(obj).subscribe(res => {
        this.getPost(this.route.snapshot.params.id);
        this.toastr.success('Voted successfully.');
        this.commonservice.user_log({ message: 'User voted successfully!' }).subscribe(res => { });
        this.spinner.hide();
        // this.feed();
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.message);
      });
    }
    if (vote === '9') {

      let obj = {
        post_id: id,
        vote: 'nine'
      }
      this.commonservice.voting(obj).subscribe(res => {
        this.getPost(this.route.snapshot.params.id);
        this.toastr.success('Voted successfully.');
        this.commonservice.user_log({ message: 'User voted successfully!' }).subscribe(res => { });
        this.spinner.hide();
        // this.feed();
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.message);
      })
    }
    if (vote === '8') {

      let obj = {
        post_id: id,
        vote: 'eight'
      }
      this.commonservice.voting(obj).subscribe(res => {
        this.getPost(this.route.snapshot.params.id);
        this.toastr.success('Voted successfully.');
        this.commonservice.user_log({ message: 'User voted successfully!' }).subscribe(res => { });
        this.spinner.hide();
        // this.feed();
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.message);
      })
    }
    if (vote === '7') {

      let obj = {
        post_id: id,
        vote: 'seven'
      }
      this.commonservice.voting(obj).subscribe(res => {
        this.getPost(this.route.snapshot.params.id);
        this.toastr.success('Voted successfully.');
        this.commonservice.user_log({ message: 'User voted successfully!' }).subscribe(res => { });
        this.spinner.hide();
        // this.feed();
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.message);
      })
    }
    if (vote === '6') {

      let obj = {
        post_id: id,
        vote: 'six'
      }
      this.commonservice.voting(obj).subscribe(res => {
        this.getPost(this.route.snapshot.params.id);
        this.toastr.success('Voted successfully.');
        this.commonservice.user_log({ message: 'User voted successfully!' }).subscribe(res => { });
        this.spinner.hide();

      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.message);
      });
    }
  }

  deleteComment(key, arr, replyArr) {
    // this.spinner.show();
    this.confirmationservice.confirm({
      message: 'Are you sure  you want to Delete?',
      accept: () => {

        if (key === 'comment') {
          this.commonservice.delete_comments(arr.comment_uid, 0, 5).subscribe(res => {
            this.getPost(this.route.snapshot.params.id)
            this.toastr.success('Comment Deleted Successfully!');
            this.commonservice.user_log({ message: 'User deleted commnent successfully!' }).subscribe(res => { });
            this.spinner.hide();
          }, err => {
            this.spinner.hide();
            this.toastr.error(err.error.message);
          })
        } else if (key === 'reply') {
          this.commonservice.delete_reply(arr.comment_uid, replyArr.comment_uid).subscribe(res => {
            this.getPost(this.route.snapshot.params.id)
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

  delete(key, arr) {

    if (key !== 'exclusive') {
      this.confirmationservice.confirm({
        message: 'Are you sure  you want to Delete?',
        accept: () => {
          this.spinner.show();
          if (key === 'post') {
            this.commonservice.delete_post(arr.post_id).subscribe(res => {
              this.toastr.success('Post Deleted Successfully');
              this.spinner.hide()
              this.router.navigate(['/creator/profile']);
              arr.isDelete = false;
              this.commonservice.user_log({ message: 'Post deleted succesfully!' }).subscribe(res => { });
            }, err => {
              this.toastr.error(err.error.message);
            });
          }

          if (key === 'pack') {
            this.commonservice.delete_pack(arr.pack_id).subscribe(res => {
              this.toastr.success('Pack Deleted Successfully');
              this.spinner.hide();
              this.router.navigate(['/creator/profile']);
              arr.isDelete = false;
              this.commonservice.user_log({ message: 'Pack deleted succesfully!' }).subscribe(res => { });
            }, err => {
              this.toastr.error(err.error.message);
            });
          }
          if (key === 'product') {
            this.commonservice.delete_product(arr.product_id).subscribe(res => {
              this.toastr.success('Product Deleted Successfully');
              this.spinner.hide();
              this.router.navigate(['/creator/profile']);
              arr.isDelete = false;
              this.commonservice.user_log({ message: 'Product deleted succesfully!' }).subscribe(res => { });
            }, err => {
              this.toastr.error(err.error.message);
            });
          }
        }
      });
    }

    if (key === 'exclusive') {
      this.confirmationservice.confirm({
        message: 'If you delete this exclusive all the funds will be reversed to users who contributed!',
        accept: () => {
          this.spinner.show();
          this.commonservice.delete_exclusive(arr.exclusive_id).subscribe(res => {
            this.toastr.success('Exclusive Deleted Successfully');
            this.spinner.hide();
            this.router.navigate(['/creator/profile']);
            arr.isDelete = false;
            this.commonservice.user_log({ message: 'Exclusive deleted succesfully!' }).subscribe(res => { });
          }, err => {
            this.toastr.error(err.error.message);
          });

        }
      });
    }
  }

  update(key, id) {
    if (key === 'post') {
      this.router.navigate(['/creator/edit/' + key + '/' + id]);
    }
    else if (key === 'pack') {
      this.router.navigate(['/creator/edit/' + key + '/' + id]);
    }
    else if (key === 'product') {
      this.router.navigate(['/creator/edit/' + key + '/' + id]);
    }
    else if (key === 'exclusive') {
      this.router.navigate(['/creator/edit/' + key + '/' + id]);
    }
  }


  ngOnInit() {
  }

}
