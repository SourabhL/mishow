import { Component, OnInit, TemplateRef } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { ConfirmationService, MenuItem } from 'primeng/api';
import * as _ from 'lodash';
import * as $ from 'jquery';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  cardForm: FormGroup;
  newCard: FormGroup;
  userDetail: any;
  modalRef: BsModalRef;
  isCreator = false;
  isSubscriber = false;
  showDropdown = false;
  quantity = 1;
  subscribeData: any = [];
  isViewProfile = false;
  tierID: any;
  userID: any;
  tierValue: any;
  currentSubscription: any = [];
  cardNumber: any;
  valueArray: any = [];
  isCardDetails = false;
  remainingDays = 0;
  usedDays = 0;
  items: MenuItem[];
  tipAmount = 0;
  customerProfileID: any;
  paymentProfileID: any;
  payType: any;
  payDescription: any;
  payAmount: any;
  payAssetID: any;
  payQuantity: any;
  perdayCostNew = 0;
  perdayCostOld = 0;
  netCost = 0;
  sendArray: any = [];
  postOptions: any = [

    { label: 'Media Post', value: 'post' },
    { label: 'Exclusives', value: 'exclusive' },
    { label: 'Packs', value: 'pack' },
    { label: 'Products', value: 'product' },
  ];

  countryList = [
    { label: 'Select any one', value: '' },
    { label: 'India', value: 'india' },
    { label: 'USA', value: 'us' }
  ];
  options = [
    { label: 'My profile', value: 'profile' },
    { label: 'Profile', value: 'profile' },
    { label: 'Logout', value: 'logout' }
  ];
  viewID: any;
  isTipValue = false;
  showSpinner = false;
  submitted = false;
  profileID: any;
  response: any;
  isAdd = false;
  isEdit = false;
  showCard = false;
  button = 'Change Subscription';
  isUpgrade = false;
  displayName: any = [];
  profileImage: any;
  profileURL: any = [];
  notLogin = false;
  notifications: any;
  notificationlength: any = [];
  uuidArray: any = [];
  nodata = false
  minYear = moment(new Date()).format('YYYY');
  maxYear = moment(new Date(new Date().setFullYear(new Date().getFullYear() + 10))).format('YYYY');


  panelLoop: any = [];
  constructor(
    private commonservice: CommonService,
    private modalService: BsModalService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private confirmationService: ConfirmationService
  ) {
    this.spinner.show();
    if (this.route.snapshot['_routerState'].url === '/login' || this.route.snapshot['_routerState'].url === '/registration') {
      this.notLogin = true;
    } else {
      this.notLogin = false;
    }

      $(document).click(function (event) {
          var clickover = $(event.target);
          var _opened = $(".navbar-collapse").hasClass("navbar-collapse collapse show");
          if (_opened === true && !clickover.hasClass("navbar-toggler")) {
              $("button.navbar-toggler").click();
          }
      });


    this.commonservice.getUser.subscribe(res => {
      this.spinner.hide();
      if (res === 'Creator') {

        this.commonservice.get_profile().subscribe((res: any) => {
          this.notLogin = false;
          this.displayName = res.display_name;
          this.profileURL = res.profile_url;
          this.onDownloadMedia(res.profile_picture).then(image => {
            this.profileImage = image;
          })
          this.userID = res.user_id;
        });


        this.isCreator = true;
      } else if (res === 'Subscriber') {

        this.commonservice.get_profile().subscribe((res: any) => {

          this.commonservice.setProfileID(res);
          this.notLogin = false;
          this.displayName = res.display_name;
          this.profileURL = res.profile_url;
          this.onDownloadMedia(res.profile_picture).then(image => {
            this.profileImage = image;
          })
          this.userID = res.user_id;
        });
        this.isSubscriber = true;
      } else if (res === undefined) {
        this.isCreator = false;
        this.isSubscriber = false;
        this.notLogin = true;
      }

    });

    this.commonservice.get_profile().subscribe((res: any) => {
      this.displayName = res.display_name;
      this.profileURL = res.profile_url;
      this.onDownloadMedia(res.profile_picture).then(image => {
        this.profileImage = image;
      })
      this.userID = res.user_id;
    });


    this.commonservice.getSubscription.subscribe((tier: any) => {

      if (tier !== '') {
        this.tierValue = tier;
        this.isEdit = true;
        this.isAdd = false;
      } else {
        this.isAdd = true;
        this.isEdit = false;
      }
    });



  }

  onSubscribe(temp) {
    this.commonservice.get_subscribe(this.viewID).subscribe((res: any) => {
      this.subscribeData = res;
      this.modalRef = this.modalService.show(temp, { class: 'modal-lg' });
      if (this.subscribeData.tier1.tier_id === this.tierValue) {
        this.currentSubscription = this.subscribeData.tier1;
      } else if (this.subscribeData.tier2.tier_id === this.tierValue) {
        this.currentSubscription = this.subscribeData.tier2;
      } else if (this.subscribeData.tier3.tier_id === this.tierValue) {
        this.currentSubscription = this.subscribeData.tier3;
      }
    });
  }
  close(temp) {
    this.modalRef.hide();
    this.modalRef = null;
  }

  unSubscribe() {
    if (this.isEdit) {
      this.confirmationService.confirm({
        message: 'Are you sure  you want to unsubscribe this creator , As your subscription is still ACTIVE?',
        accept: () => {
          this.commonservice.getProfileID.subscribe(res1 => {
            this.commonservice.unSubscribe(res1).subscribe((res: any) => {
              this.toastr.success('Successfully Unsubscribed.');
              this.commonservice.user_log({ message: 'User unsubscribe successfully!' }).subscribe(res => { });
            }, err => {
              this.toastr.error(err.error.message);
            });
          });
        }
      });
    } else {
      this.confirmationService.confirm({
        message: 'Are you sure  you want to unsubscribe this creator?',
        accept: () => {
          this.commonservice.getProfileID.subscribe(res1 => {
            this.commonservice.unSubscribe(res1).subscribe((res: any) => {
              this.toastr.success('Successfully Unsubscribed.', 'Success!', { timeOut: 3000 });
              this.commonservice.user_log({ message: 'User unsubscribe successfully!' }).subscribe(res => { });
            }, err => {
              this.toastr.error(err.error.message);
            });
          });
        }
      });
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

  ondropdownClick() {


    if (this.userDetail['cognito:groups'][0] === 'Creator') {

      this.commonservice.get_profile().subscribe((res: any) => {
        this.notLogin = false;
        this.displayName = res.display_name;
        this.profileURL = res.profile_url;
        this.onDownloadMedia(res.profile_picture).then(image => {
          this.profileImage = image;
        })
        this.userID = res.user_id;
      });


      this.isCreator = true;
    } else if (this.userDetail['cognito:groups'][0] === 'Subscriber') {

      this.commonservice.get_profile().subscribe((res: any) => {

        this.commonservice.setProfileID(res);
        this.notLogin = false;
        this.displayName = res.display_name;
        this.profileURL = res.profile_url;
        this.onDownloadMedia(res.profile_picture).then(image => {
          this.profileImage = image;
        })
        this.userID = res.user_id;
      });
      this.isSubscriber = true;
    } else if (this.userDetail['cognito:groups'][0] === undefined) {
      this.isCreator = false;
      this.isSubscriber = false;
      this.notLogin = true;
    }

  }

  onTip(key, temp) {

    if (this.tipAmount > 0) {
      this.showSpinner = true;
      this.payType = key;
      this.payDescription = 'Tip';
      this.payAmount = this.tipAmount;
      this.payAssetID = this.viewID;
      this.payQuantity = 1;
      this.commonservice.getCardDetail().subscribe((res: any) => {
        if (res) {
          this.showSpinner = false;
          this.paymentProfileID = res.profile.paymentProfiles[0].customerPaymentProfileId;
          this.customerProfileID = res.profile.customerProfileId;
          this.cardNumber = res.profile.paymentProfiles[0].payment.creditCard.cardNumber.split('X').pop();
          this.isCardDetails = true;
          this.modalRef.hide();
          this.modalRef = null;
          this.modalRef = this.modalService.show(temp, { class: 'modal-lg' });
        }
      }, err => {
        this.modalRef.hide();
        this.modalRef = null;
        this.showSpinner = false;
        this.modalRef = this.modalService.show(temp, { class: 'modal-lg' });
        this.isCardDetails = false;
        this.toastr.error(err.error.message);
      });
    } else {
      this.isTipValue = true;
    }

  }

  displayForm() {
    this.showCard = true;
    this.newCradFormInit();
  }
  homeClick() {
    if (this.isCreator) {
      this.router.navigate(['/creator']);
    } else {
      this.router.navigate(['/subscriber']);
    }
  }


  async onDownloadMedia(files) {
    console.log('files=>', files);

    return new Promise((pass, fail) => {
      this.commonservice.getDownloadPresignURL('download', files).subscribe((data: any) => {

        if (data.url) {
          pass(data.url);
        }
      });
    });
  }

  card() {
    let obj = {
      creator_id: this.viewID,
      asset: {
        asset_id: this.payAssetID,
        creator_id: this.viewID,
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
      this.commonservice.getProfileID.subscribe(res1 => {
        if (this.payType === 'subscription_upgrade' && this.isUpgrade) {
          this.commonservice.upgradeSubscription(res1, this.payQuantity, res.transId).subscribe(res => {
            this.toastr.success('Subscription updated successfully');
            this.commonservice.user_log({ message: 'User update subscription successfully!' }).subscribe(res => { });
            this.modalRef.hide();
            this.modalRef = null;
          }, err => {
            this.showSpinner = false;
            this.toastr.error(err.error.message);
          });
        }
        if (this.payType === 'subscription' && !this.isUpgrade) {
          this.commonservice.subscribeWithPurchase(res1, this.tierID.tier_id, res.transId).subscribe(res => {
            this.toastr.success('Subscribe Successfully');
            this.commonservice.user_log({ message: 'User subscribe successfully!' }).subscribe(res => { });
            this.modalRef.hide();
            this.modalRef = null;
          }, err => {
            this.showSpinner = false;
            this.toastr.error(err.error.message);
          });
        }
      });

      if (this.payType !== 'subscribe') {
        this.modalRef.hide();
        this.modalRef = null;
      }

    }, err => {
      this.showSpinner = false;
      this.toastr.error(err.error.message);
    })

  }

  ngOnInit() {
    this.commonservice.getViewProfile.subscribe((res: any) => {
      if (res) {
        this.isViewProfile = true;
        this.viewID = res;
      }
    });


    this.userDetail = this.commonservice.getLoggedUserDetail();
    setTimeout(() => {
      this.spinner.hide();
      if (this.userDetail) {
        if (!(this.userDetail['cognito:groups'])) {
          this.isCreator = false;
          this.isSubscriber = false;
        } else if (this.userDetail['cognito:groups'][0] === 'Creator') {

          this.isCreator = true;
        } else {
          this.isSubscriber = true;
        }
      }
    }, 1000);



    setInterval(() => {

      if (this.isCreator) {

        this.commonservice.liveCreatorNotification().then((res: any) => {

          if (res['ReceiveMessageResponse']['ReceiveMessageResult']['messages'] !== null) {

            if (this.notificationlength.length == 0) {

              res['ReceiveMessageResponse']['ReceiveMessageResult']['messages'].forEach(e => {

                e.Body = JSON.parse(e.Body);

                if (this.userID === e.Body.user_id) {
                  this.toastr.success(e.Body.event_type)
                    .onTap
                    .pipe()
                    .subscribe(() => this.creatorNavigate(e));

                  this.notificationlength.push(e);
                  this.notificationlength.forEach(e => {
                    this.uuidArray.push({ 'uuid': e.Body.uuid });
                  });
                }
              });

            } else {
              res['ReceiveMessageResponse']['ReceiveMessageResult']['messages'].forEach(e => {
                e.Body = JSON.parse(e.Body);
                console.log('e.body=>', e.Body);
                this.notificationlength.forEach(e => {
                  this.uuidArray.push({ 'uuid': e.Body.uuid });
                });


                let ans = _.find(this.uuidArray, { 'uuid': e.Body.uuid });

                if (ans === undefined) {
                  if (this.userID === e.Body.user_id) {
                    this.toastr.success(e.Body.event_type)
                      .onTap
                      .pipe()
                      .subscribe(() => this.creatorNavigate(e));

                    this.notificationlength.push(e);
                  }

                } else { }
              });
            }
            this.notificationlength.forEach(e => {
              let ans = _.find(this.sendArray, { 'uuid': e.Body.uuid });
              if (ans === undefined) {
                this.sendArray.push({ uuid: e.Body.uuid, ReceiptHandle: e.ReceiptHandle });
              }
            });

            // this.commonservice.setViewNotifications(JSON.stringify(this.sendArray));
            // console.log('this.notificationlength=>', this.sendArray);
            this.commonservice.setNotification(this.notificationlength);
          } else {
            this.notificationlength = [];

          }

        }).catch(err => console.log({ err }));

      } else {
        this.commonservice.liveSubscriberNotification().then((res: any) => {

          if (res['ReceiveMessageResponse']['ReceiveMessageResult']['messages'] !== null) {
            if (this.notificationlength.length == 0) {
              res['ReceiveMessageResponse']['ReceiveMessageResult']['messages'].forEach(e => {

                e.Body = JSON.parse(e.Body);
                if (this.userID === e.Body.user_id) {
                  this.toastr.success(e.Body.event_type)
                    .onTap
                    .pipe()
                    .subscribe(() => this.creatorNavigate(e));

                  this.notificationlength.push(e);
                  this.notificationlength.forEach(e => {
                    this.uuidArray.push({ 'uuid': e.Body.uuid });
                  });
                }
              });

            } else {
              res['ReceiveMessageResponse']['ReceiveMessageResult']['messages'].forEach(e => {
                e.Body = JSON.parse(e.Body);
                this.notificationlength.forEach(e => {
                  this.uuidArray.push({ 'uuid': e.Body.uuid });
                });
                let ans = _.filter(this.uuidArray, { 'uuid': e.Body.uuid });

                if (ans === undefined) {


                  if (this.userID === e.Body.user_id) {
                    this.toastr.success(e.Body.event_type)
                      .onTap
                      .pipe()
                      .subscribe(() => this.creatorNavigate(e));

                    this.notificationlength.push(e);

                  }

                } else { }
              });
            }


            this.commonservice.setNotification(this.notificationlength);
          } else {
            this.notificationlength = [];

          }
        }).catch(err => console.log({ err }));

      }
    }, 300000);

    this.commonservice.getNotification.subscribe((notification: any) => {

      this.panelLoop = [];
      this.notifications = notification.length;
      let dt1;
      let dt2;
      if (notification) {
        notification.forEach(e => {
          dt1 = this.commonservice.scheduleDate(e.Body.created_at);

          dt2 = moment(dt1, 'YYYY-MM-DD').format('MM/DD/YYYY hh:mm');
          e.date = moment(dt2, 'MM/DD/YYYY hh:mm').fromNow();
          this.panelLoop.push(e);

        });
        this.nodata = false;
      } else {
        this.nodata = true;
      }

    });
  }


  creatorNavigate(arr) {

    let obj = {
      uuid: arr.Body.uuid,
      ReceiptHandle: arr.ReceiptHandle
    }
    this.commonservice.viewedNotification(obj).subscribe(res => { })
    if (this.isCreator) {

      this.router.navigate(['/creator/' + arr.Body.hyperlink]);
    } else {
      this.router.navigate(['/subscriber/' + arr.Body.hyperlink]);

    }
  }

  navigate(arr) {
    let obj = {
      uuid: arr.Body.uuid,
      ReceiptHandle: arr.ReceiptHandle
    }
    this.commonservice.viewedNotification(obj).subscribe(res => { })
    if (this.isCreator) {

      this.router.navigate(['creator/' + arr.Body.hyperlink]);
    } else {
      this.router.navigate(['subscriber/' + arr.Body.hyperlink]);
    }
  }
  onChange(e) {
    this.commonservice.setFilter(e.value);
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

  onNewcardSubmit(valid) {
    this.submitted = true;
    if (valid) {
      this.showSpinner = true;
      let name = this.newCard.value.newLegalName.split(' ');
      let obj = {
        customerProfileId: this.customerProfileID,
        asset: {
          asset_id: this.payAssetID,
          creator_id: this.viewID,
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
        this.commonservice.user_log({ message: 'User added card successfully!' }).subscribe(res => { });
        this.commonservice.getProfileID.subscribe(res1 => {
          if (this.payType === 'subscription_upgrade' && this.isUpgrade) {
            this.commonservice.upgradeSubscription(res1, this.payQuantity, res.transId).subscribe(res => {
              this.toastr.success('Subscription updated successfully');
              this.commonservice.user_log({ message: 'User update subscription successfully!' }).subscribe(res => { });
              this.modalRef.hide();
              this.modalRef = null;
            }, err => {
              this.showSpinner = false;
              this.toastr.error(err.error.message);
            });
          }
          if (this.payType === 'subscription' && !this.isUpgrade) {
            this.commonservice.subscribeWithPurchase(res1, this.tierID.tier_id, res.transId).subscribe(res => {
              this.toastr.success('Subscribe Successfully', 'Success!', { timeOut: 3000 });
              this.commonservice.user_log({ message: 'User subscribe successfully!' }).subscribe(res => { });
              this.modalRef.hide();
              this.modalRef = null;
            }, err => {
              this.showSpinner = false;
              this.toastr.error(err.error.message);
            });

          }
        });
        if (this.payType !== 'subscribe') {
          this.modalRef.hide();
          this.modalRef = null;
        }
      }, err => {
        this.showSpinner = false;
        this.toastr.error(err.error.message);
      });
    }
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

  logout() {
    this.commonservice.logout({ access_token: localStorage.getItem('access_token') }).subscribe(res => {
      this.commonservice.user_log({ message: 'User logout successfully!' }).subscribe(res => { });
      this.commonservice.setProfileID('true');
      this.displayName = [];
      this.profileURL = [];
      this.profileImage = [];
      this.isCreator = false;
      this.isSubscriber = false;
      this.notLogin = true;
      this.router.navigate(['/']);
      localStorage.removeItem('id_token');
      localStorage.removeItem('access_token');

      this.toastr.success('Logout Successfuully.');
    }, err => {
      this.toastr.error(err.error);
      this.displayName = [];
      this.profileURL = [];
      this.profileImage = [];
      this.isCreator = false;
      this.isSubscriber = false;
      this.notLogin = true;
      this.router.navigate(['/']);
      localStorage.removeItem('id_token');
      localStorage.removeItem('access_token');
    });

  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    // this.modalRef.setClass('modal-md');
  }

  onNotification(arr) {
    if (this.isCreator) {
      this.router.navigate(['/creator/notification']);
    } else {
      this.router.navigate(['/subscriber/notification']);
    }
    let obj = {
      uuid: arr.Body.uuid,
      ReceiptHandle: arr.ReceiptHandle
    }
    this.commonservice.viewedNotification(obj).subscribe(res => { })
    this.isViewProfile = false;

  }

  gotoNotification() {
    if (this.isCreator) {
      this.router.navigate(['/creator/notification']);
    } else {
      this.router.navigate(['/subscriber/notification']);
    }
  }

  onSettings() {
    this.isViewProfile = false;
    if (this.isCreator) {
      this.router.navigate(['/creator/settings/account_setting']);
    } else {
      this.router.navigate(['/subscriber/settings/notification_setting']);
    }
  }

  onProfile() {
    this.isViewProfile = false;
    if (this.isCreator) {
      this.router.navigate(['/creator/profile']);
    } else if (this.isSubscriber) {
      this.router.navigate(['/subscriber/profile']);
    }

  }
  openSuggetion(temp) {
    this.isViewProfile = false;
    this.openModal(temp);
  }
  onClick(text) {
    this.isViewProfile = false;
    this.modalRef.hide();
    this.modalRef = null;
    if (text === 1) {
      this.router.navigate(['/creator/post/addpost']);
    } else if (text === 2) {
      this.router.navigate(['/creator/post/addexclusive']);
    } else if (text === 3) {
      this.router.navigate(['/creator/post/addproduct']);
    } else if (text === 4) {
      this.router.navigate(['/creator/post/addpack']);
    }
  }

  openPurchase(data, temp) {
    this.modalRef.hide();
    this.modalRef = null;
    this.tierID = data;

    this.payType = 'subscription';
    this.payDescription = this.tierID.tier_name;
    this.payQuantity = this.tierID.tier_id;
    this.payAssetID = this.tierID.creator_id;
    this.payAmount = parseFloat(this.tierID.tier_price);
    this.commonservice.getCardDetail().subscribe((res: any) => {
      if (res != '') {
        this.paymentProfileID = res.profile.paymentProfiles[0].customerPaymentProfileId;
        this.customerProfileID = res.profile.customerProfileId;
        this.cardNumber = res.profile.paymentProfiles[0].payment.creditCard.cardNumber.split('X').pop();
        this.isCardDetails = true;
        this.modalRef = this.modalService.show(temp, { class: 'modal-lg' });
      }
    }, err => {
      this.formInit();
      this.isCardDetails = false;
      this.modalRef = this.modalService.show(temp, { class: 'modal-lg' });
    });

  }
  onSubmit(valid) {
    this.submitted = true;
    if (valid) {
      this.showSpinner = true;
      let name = this.cardForm.value.legal_name.split(' ');
      let obj = {
        creator_id: this.viewID,
        asset: {
          asset_id: this.payAssetID,
          creator_id: this.viewID,
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
        this.commonservice.getProfileID.subscribe(res1 => {
          this.commonservice.subscribeWithPurchase(res1, this.tierID.tier_id, res.transId).subscribe(res => {
            this.toastr.success('Subscribe Successfully');
            this.commonservice.user_log({ message: 'User  subscribe successfully!' }).subscribe(res => { });
          }, err => {
            this.showSpinner = false;
            this.toastr.error(err.error.message);
          });
        });
      }, err => {
        this.showSpinner = false;
        this.toastr.error(err.error.message);
      });
    } else {
      this.showSpinner = false;
    }
  }

  onTips(temp) {
    this.openModal(temp);
  }
  plus() {
    this.isViewProfile = false;
    this.quantity++;
  }
  minus() {
    this.isViewProfile = false;
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  onUpdate(data, temp) {
    this.modalRef.hide();
    this.modalRef = null;
    this.tierID = data;
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
      if (res != '') {
        this.paymentProfileID = res.profile.paymentProfiles[0].customerPaymentProfileId;
        this.customerProfileID = res.profile.customerProfileId;
        this.cardNumber = res.profile.paymentProfiles[0].payment.creditCard.cardNumber.split('X').pop();
        this.isCardDetails = true;
        this.modalRef = this.modalService.show(temp, { class: 'modal-lg' });

      }
    }, err => {
      this.formInit();
      this.isCardDetails = false;
      this.modalRef = this.modalService.show(temp, { class: 'modal-lg' });
    });

  }
  openNotification(temp) {
    this.router.navigate(['/creator/notification']);
  }
}



