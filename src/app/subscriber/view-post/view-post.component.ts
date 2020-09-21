import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/service/common.service';
import * as moment from 'moment';
@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent implements OnInit {
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
  setDefault = false;
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
  userName: any;
  savedCard: any = []
  showCard = false;
  isPackPurchase = false;
  isProductPurchase = false;
  isExclusivePurchase = false;
  title = '';
  button = 'Submit';
  showSpinnerNew = false;
  contributionValue: any = [];
  quantity = 0;
  originalCost = 0;
  remainingQuantity = 0;
  originalQty = 0;
  packCost: any;
  purchaseWith: any;
  tipType: any = [];
  subscriberUsername: any;
  start = 0;
  limit = 5;
  productCost: any;
  subscriberUserID: any;
  NotificationID: any;
  contributionsList: any = [];
  countryList = [
    { label: 'Select any one', value: '' },
    { label: 'India', value: 'india' },
    { label: 'USA', value: 'us' }
  ];
  infoRequired: any;
  isAvailQuantity = false;
  information: any = [];
  taxID: any;
  taxesAmount: any;
  taxes: any = [];
  state: any;
  basicTotal: any;
  finalTotal: any;
  constructor(private commonservice: CommonService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private confirmationservice: ConfirmationService,
    private router: Router) {
    this.spinner.show();

    if (this.route.snapshot.params.type === 'post') {
      this.getPost(this.route.snapshot.params.id);
    }

    if (this.route.snapshot.params.type === 'pack') {
      this.isPack = true;
      this.commonservice.get_pack_id(this.route.snapshot.params.id).subscribe((res: any) => {
        this.data = res;

        let dt1 = this.commonservice.scheduleDate(this.data.publish_date);
        this.data.publish_date = moment(dt1, 'YYYY-MM-DD').format('MMM DD');
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


    if (this.route.snapshot.params.type === 'product') {
      this.isProduct = true;
      this.commonservice.get_product_id(this.route.snapshot.params.id).subscribe((res: any) => {
        this.data = res;
        this.media = {
          image: [],
          video: []
        };
        let dt1 = this.commonservice.scheduleDate(this.data.created_at);
        this.data.created_at = moment(dt1, 'YYYY-MM-DD').format('MMM DD');

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
      this.getExclusive(this.route.snapshot.params.id);

    }

    this.commonservice.viewProfile(this.route.snapshot.params.profileurl).subscribe((res: any) => {
      console.log('view post=======>');
      this.onDownloadMedia(res.profile_picture).then(image => {
        res.profile_picture = image;
      })
      this.profile = res;
      this.userID = res.user_id;
      this.userName = res.profile_url;
    });

    this.commonservice.get_profile().subscribe((res: any) => {
      this.onDownloadMedia(res.profile_picture).then(image => {
        this.subscriberImage = image;
      });
      this.subscriberName = res.display_name;

      this.subscriberUsername = res.profile_url;
      this.subscriberUserID = res.user_id;
      this.commonservice.checkSubscription(res.profile_id).subscribe((res: any) => {
        if (res.subscription_status === 'ACTIVE' || res.subscription_status === 'NEW') {
          this.isActive = true;
        }
      });
    });
    this.spinner.hide();
  }

  onContribute(temp, id) {
    this.exclusiveID = id;
    this.openModal(temp);
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
          const videoStr = isVideo.join(','); console.log('on downloade=>', e);
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

      this.isPost = true;
    })
  }

  getExclusive(id) {
    this.isExclusive = true;
    this.commonservice.get_exclusive_id(id).subscribe((res: any) => {
      this.data = res;
      this.media = {
        image: [],
        video: []
      };
      const isImages = ['jpg', 'jpeg', 'png', 'webp'];
      const isVideo = ['mp4'];

      let dt1 = this.commonservice.scheduleDate(this.data.created_on);
      this.data.created_on = moment(dt1, 'YYYY-MM-DD').format('MMM DD');


      if (this.data.available_now === true) {
        this.data.exclusive_content.forEach(e => {
          const imgStr = isImages.join(',');
          const videoStr = isVideo.join(',');
          console.log('on downloade=>', e);
          if (imgStr.includes(e.split('.').pop()) === true) {
            this.onDownloadMedia(e).then(res => {
              this.media.image.push(res);
            });
          } else {
            this.onDownloadMedia(e).then(res => {
              this.media.image.push(res);
            });
          }
        });
      } else {
        this.data.media.forEach(e => {
          const imgStr = isImages.join(',');
          const videoStr = isVideo.join(',');
          console.log('on downloade=>', e);
          if (imgStr.includes(e.split('.').pop()) === true) {
            this.onDownloadMedia(e).then(res => {
              this.media.image.push(res);
            });
          } else {
            this.onDownloadMedia(e).then(res => {
              this.media.image.push(res);
            });
          }
        });
      }


    });
  }


  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    // this.modalRef.setClass('modal-md');
  }

  OnContributionChange(e) {
    this.payAmount = e.value;

    if (this.payAmount === undefined) {
      this.isValue = true;
    } else {
      this.isValue = false;
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
          this.getExclusive(this.route.snapshot.params.id);
          this.toastr.success('Card Detail Added successfully');
          this.commonservice.user_log({ message: 'User added card detail successfully!' }).subscribe(res => { });
          if (this.payType === 'exclusive') {
            this.commonservice.contribute({ exclusive_id: this.exclusiveID, contribution_amount: this.payAmount, transaction_id: res.transId }).subscribe(res => {
              this.toastr.success('Contributed Successfully');
              this.commonservice.user_log({ message: 'User contributed successfully!' }).subscribe(res => { });
              this.modalRef.hide();
              this.modalRef = null;
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


          if (this.payType === 'pack') {
            this.router.navigate(['/viewpack/' + this.payAssetID]);
            this.modalRef.hide();
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
                hyperlink: "mi.show/post/" + this.NotificationID,
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
        this.spinner.show();
        this.showSpinner = true;

        this.commonservice.cardDeatil(obj).subscribe((res: any) => {

          this.toastr.success('Card Detail Added successfully');
          if (this.payType === 'exclusive') {
            this.commonservice.contribute({ exclusive_id: this.exclusiveID, contribution_amount: this.payAmount, transaction_id: res.transId }).subscribe(res => {
              this.getExclusive(this.route.snapshot.params.id);
              this.toastr.success('Contributed Successfully');
              this.showSpinner = false;
              this.commonservice.user_log({ message: 'User contributed successfully!' }).subscribe(res => { });
              this.modalRef.hide();
              this.modalRef = null;
              this.showCard = false;
              this.newCard.reset();
              this.submitted = false;
              this.contributionValue = [];
              this.contributionsList = [];
              this.savedCard = [];
              // this.feed();
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

    } else if (this.payType === 'product') {
      this.modalRef.hide();
      this.modalRef = null;
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
      this.showSpinner = true;
      this.spinner.show();
      this.commonservice.cardDeatil(obj).subscribe((res: any) => {
        this.showSpinner = false;
        this.toastr.success('Card Detail Added successfully');



        if (this.payType === 'pack') {
          this.router.navigate(['/viewpack/' + this.payAssetID]);
          this.modalRef.hide();
          this.modalRef = null;
          this.showCard = false;
          this.newCard.reset();
          this.submitted = false;
          this.savedCard = [];

          this.spinner.hide();
        }


        if (this.payType === 'tip' && this.tipType === 'comment') {
          this.commonservice.tip_comment(this.commentID.post_id, this.commentID.comment_uid, res.transId).subscribe(res => {
            this.toastr.success('Give tip to comment successfully');
            let obj = {

              event_type: 'NEW_TIP',
              user_id: this.userID,
              message: 'new tip from ' + this.subscriberUsername + ' on the Comment',
              hyperlink: "mi.show/post/" + this.NotificationID,
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
              amount: this.payAmount
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
                this.getExclusive(this.route.snapshot.params.id);
                this.commonservice.user_log({ message: 'User contributed successfully!' }).subscribe(res => { });
                this.modalRef.hide();
                this.modalRef = null;
                this.showCard = false;
                this.showSpinnerNew = false;
                this.newCard.reset();
                this.contributionValue = [];
                this.contributionsList = [];
                this.submitted = false;
                this.savedCard = [];

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
                amount: this.payAmount
              },
              customerProfileId: newCard.customerProfileId,
              paymentProfileId: newCard.customerPaymentProfileId
            };
            this.commonservice.cardDeatil(pay).subscribe((card: any) => {

              this.toastr.success('Card Added successfully');
              this.commonservice.user_log({ message: 'User added new card successfully!' }).subscribe(res => { });



              if (this.payType === 'pack') {
                this.router.navigate(['/viewpack/' + this.payAssetID]);
                this.modalRef.hide();
                this.modalRef = null;
                this.showCard = false;
                this.newCard.reset();
                this.submitted = false;
                this.savedCard = [];

                this.spinner.hide();
              }


              if (this.payType === 'tip' && this.tipType === 'comment') {
                this.commonservice.tip_comment(this.commentID.post_id, this.commentID.comment_uid, card.transId).subscribe(res => {
                  this.toastr.success('Give tip to comment successfully');
                  let obj = {
                    event_type: 'NEW_TIP',
                    user_id: this.userID,
                    message: 'New tip from ' + this.subscriberUsername + ' on the Comment',
                    hyperlink: "mi.show/post/" + this.NotificationID,
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
        this.modalRef = null;
        this.savedCard = [];
        this.showCard = false;
        this.newCard.reset();
        this.submitted = false;
        this.toastr.success('Product purchase successfully!');
        this.commonservice.modifyQty(this.payAssetID, this.payQuantity).subscribe(res => { })
        this.spinner.hide();

      }, err => {
        this.spinner.hide()
        this.showSpinner = false;
        this.toastr.error(err[0].text);
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
          amount: this.payAmount
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
        this.toastr.error(err[0].text);
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
              amount: this.payAmount
            },
            customerProfileId: newCard.customerProfileId,
            paymentProfileId: newCard.customerPaymentProfileId
          };
          this.commonservice.cardDeatil(pay).subscribe((card: any) => {
            this.commonservice.modifyQty(this.payAssetID, this.payQuantity).subscribe(res => { })
            this.modalRef.hide();
            this.modalRef = null;
            this.showCard = false;
            this.newCard.reset();
            this.submitted = false;
            this.savedCard = [];
            this.toastr.success('User buy product successfully!');
            this.spinner.hide();
          }, err => {
            this.showSpinner = false;
            this.spinner.hide()
            this.toastr.error(err[0].text);
          });
        }

      }, err => {
        this.showSpinner = false;
        this.spinner.hide()
        this.toastr.error(err[0].text);
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
      };
      this.commonservice.cardDeatil(obj).subscribe((res: any) => {
        this.commonservice.modifyQty(this.payAssetID, this.payQuantity).subscribe(res => { })
        this.showSpinner = false;
        this.toastr.success('Card Detail Added successfully');
        this.commonservice.user_log({ message: 'User added card detail successfully!' }).subscribe(res => { });

        this.modalRef.hide();
        this.modalRef = null;
        this.showCard = false;
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

  taxCount(e) {

    this.commonservice.addTaxes(this.userID, this.cardForm.value.state, this.payType, this.taxID, { 'revenue_sharing': [] }).subscribe((taxes: any) => {

      this.taxes = taxes;

      this.basicTotal = taxes.item_subtotal;
      this.finalTotal = taxes.total_payment;
      this.taxesAmount = taxes.card_transaction_fee + taxes.state_taxes + taxes.platform_fee_subscriber;
      // this.spinner.hide();
    })
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
      this.taxID = arr.price

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
      this.taxID = arr.price;
      this.originalCost = arr.price;
      this.button = 'Purchase';

      if (arr.info_needed_for_delivery !== '') {
        this.infoRequired = arr.info_needed_for_delivery;
      }


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
      this.taxID = arr.min_contribution;
      let l1 = arr.min_contribution;
      let l2 = arr.min_contribution;
      for (let i = 0; i <= 5; i++) {
        this.contributionValue.push(l2);
        l2 = l2 + l1;
      }
      this.contributionValue.forEach(e => {
        if (this.contributionsList.length == 0) {
          this.contributionsList.push({ label: 'Select any one', value: '' })
        } else {

          this.contributionsList.push({ label: e, value: e });
        }
      });

    }

    this.commonservice.getCardDetail().subscribe((res: any) => {
      this.state = res.profile.shipToList[0].state;
      this.commonservice.addTaxes(this.userID, res.profile.shipToList[0].state, key, this.taxID, { 'revenue_sharing': [] }).subscribe((taxes: any) => {
        this.taxes = taxes;
        this.basicTotal = taxes.item_subtotal;
        this.finalTotal = taxes.total_payment;
        this.taxesAmount = taxes.card_transaction_fee + taxes.state_taxes + taxes.platform_fee_subscriber;
        this.spinner.hide();
      })
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
      this.showSpinner = false;
      this.modalRef = this.modalService.show(temp, { class: 'CardDetailsPopup modal-lg' });
      this.spinner.hide();
      this.formInit();
      this.isCardDetails = false;
      this.toastr.error(err.error.message);
    });

  }


  reply(arr) {
    this.commentID = arr;
    arr.replaytoComment = true;
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

  onContributionBlur(e) {
    this.commonservice.addTaxes(this.userID, this.state, this.payType, e.value, { 'revenue_sharing': [] }).subscribe((taxes: any) => {
      this.taxes = taxes;
      this.basicTotal = taxes.item_subtotal;
      this.finalTotal = taxes.total_payment;
      this.taxesAmount = taxes.card_transaction_fee + taxes.state_taxes + taxes.platform_fee_subscriber;
    })
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
              console.log('on download ele.profile[0].profile_picture =>', ele.profile[0].profile_picture);
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
                    console.log('on download e.profile[0].profile_picture =>', e.profile[0].profile_picture);
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
              console.log('on download ele.profile[0].profile_picture =>', ele.profile[0].profile_picture);
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
                    console.log('on download e.profile[0].profile_picture =>', e.profile[0].profile_picture);
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
          hyperlink: "mi.show/post/" + this.NotificationID,
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
              console.log('on download ele.profile[0].profile_picture =>', ele.profile[0].profile_picture);
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
                    console.log('on download e.profile[0].profile_picture =>', e.profile[0].profile_picture);
                    this.onDownloadMedia(e.profile[0].profile_picture).then(image => {
                      e.profile[0].profile_picture = image;
                    })
                  });
                });
              }
            });

          }
        });
        this.NotificationID = arr.post_id;

        let obj = {
          event_type: 'NEW_COMMENT',
          user_id: this.userID,
          message: 'Reply from ' + this.subscriberUsername + ' on the post',
          hyperlink: "mi.show/post/" + this.NotificationID,
          from_info: {
            display_name: this.subscriberName,
            profile_url: this.subscriberUsername,
            profile_picture: this.subscriberImage
          }

        }



        this.commonservice.creator_notification(obj).subscribe((res: any) => { })


        this.toastr.success('Replied to comment successfully!');
        this.commonservice.user_log({ message: 'Userreply to comment successfully!' }).subscribe(res => { });
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.message);
      });
    }
  }

  updateComment(arr) {
    // this.commentArr = arr;
    arr.isModify = true;
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
                  });
                });


              });
            }
          });

        }
      });
    }
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



  Voting(vote, id) {

    this.spinner.show();
    if (vote === '10') {
      let obj = {
        post_id: id.post_id,
        vote: 'ten'
      }
      this.commonservice.voting(obj).subscribe(res => {

        this.commonservice.get_post_id(id.post_id).subscribe((post: any) => {
          this.commonservice.getAllVotes(id.post_id).subscribe((vote: any) => {
            id.vote = [];
            id.vote = vote;
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
        post_id: id.post_id,
        vote: 'nine'
      }
      this.commonservice.voting(obj).subscribe(res => {
        this.commonservice.get_post_id(id.post_id).subscribe((post: any) => {
          this.commonservice.getAllVotes(id.post_id).subscribe((vote: any) => {
            id.vote = [];
            id.vote = vote;
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
        post_id: id.post_id,
        vote: 'eight'
      }
      this.commonservice.voting(obj).subscribe(res => {
        this.commonservice.get_post_id(id.post_id).subscribe((post: any) => {
          this.commonservice.getAllVotes(id.post_id).subscribe((vote: any) => {
            id.vote = [];
            id.vote = vote;
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
        post_id: id.post_id,
        vote: 'seven'
      }
      this.commonservice.voting(obj).subscribe(res => {
        this.commonservice.get_post_id(id.post_id).subscribe((post: any) => {
          this.commonservice.getAllVotes(id.post_id).subscribe((vote: any) => {
            id.vote = [];
            id.vote = vote;
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
        post_id: id.post_id,
        vote: 'six'
      }
      this.commonservice.voting(obj).subscribe(res => {
        this.commonservice.get_post_id(id.post_id).subscribe((post: any) => {
          this.commonservice.getAllVotes(id.post_id).subscribe((vote: any) => {
            id.vote = [];
            id.vote = vote;
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
            this.getPost(this.route.snapshot.params.id);
            this.toastr.success('Comment Deleted Successfully!');
            this.commonservice.user_log({ message: 'User deleted commnent successfully!' }).subscribe(res => { });
            this.spinner.hide();
          }, err => {
            this.spinner.hide();
            this.toastr.error(err.error.message);
          })
        } else if (key === 'reply') {
          this.commonservice.delete_reply(arr.comment_uid, replyArr.comment_uid).subscribe(res => {
            this.getPost(this.route.snapshot.params.id);
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




  ngOnInit() {
  }

}
