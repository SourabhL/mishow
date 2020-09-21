import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { CommonService } from 'src/app/service/common.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { ConfirmationService } from 'primeng/api';
import { CountryService } from 'src/app/service/country.service';
import { analyzeFileForInjectables } from '@angular/compiler';
import { async } from '@angular/core/testing';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  @ViewChild('clipboard', null) clipboard: ElementRef;
  purchaseForm: FormGroup;
  modalRef: BsModalRef;
  fireBadge = false;
  heartBadge = false;
  smileBadge = false;
  sadBadge = false;
  quantity = 1;
  poopBadge = false;
  fireCount = 0;
  heartCount = 0;
  smileCount = 0;
  showSpinnerNew = false;
  sadCount = 0;
  poopCount = 0;
  showCard = false;
  profiles: any = [];
  userDetails: any = [];
  SuggestionPopup = false;
  subscriptionList: any = [];
  isCreator = false;
  isSubscriber = false;
  postData: any = [];
  packData: any = [];
  productData: any = [];
  exclusiveData: any = [];
  postArray: any = [];
  packArray: any = [];
  prodArray: any = [];
  exclusivearray: any = [];
  FinalArray: any = [];
  start = 0;
  limit = 5;
  medias: any = [];
  tagArray: any = [];
  postVideoCount = 0;
  postImageCount = 0;
  showSpinner = false;
  payType: any;
  payDescription: any;
  payAmount: any;
  payAssetID: any;
  arr: any = [];
  payQuantity: any;
  contributionsList: any = [];
  notShow = false;
  savedCard: any = [];
  isAvailQuantity = false;
  isPackPurchase = false;
  isProductPurchase = false;
  isExclusivePurchase = false;
  contributionValue: any = [];
  remainingQuantity = 0;
  originalQty = 0;
  originalCost = 0;
  netCost = 0;
  packCost: any;
  productCost: any;
  title = '';
  paymentProfileID: any;
  button = 'Submit';
  isCardDetails = false;
  infoRequired: any = [];
  customerProfileID: any = [];
  cardForm: FormGroup;
  newCard: FormGroup;
  submitted = false;
  contribution = 0;
  isValue = false;
  exclusiveID: any;
  userID: any;
  userName: any;
  subscribeData: any = [];
  purchaseWith: any;
  tipType: any = [];
  setDefault = false;
  subscriberName: any;
  loggedUserImage: any;
  information: any;
  isPOstDone = false;
  comment: any;
  mediaImages: any = [];
  postId: any;
  isUpdateComment = false;
  NotificationID: any;
  subscriberUserID: any;
  subscriberUsername: any;
  commentArr: any = [];
  commentID: any;
  isdone = false;
  postLength = 0;
  packLength = 0;
  productLength = 0;
  exclusiveLength = 0;
  Finallength = 0;
  isPOST = false;
  isPACK = false;
  isPRODUCT = false;
  isEXCLUSIVE = false;
  postLimit = 10;
  postSkip = 0;
  packLimit = 10;
  packSkip = 0;
  productLimit = 10;
  productSkip = 0;
  exclusiveLimit = 10;
  exclusiveSkip = 0;
  basicTotal: any;
  finalTotal: any;
  taxID: any;
  taxesAmount: any;
  taxes: any = [];
  state: any;
  copiedText = '';
  countryList = [
    { label: 'Select any one', value: '' },
  ];
  isTaxShow = false;
  minYear = moment(new Date()).format('YYYY');
  maxYear = moment(new Date(new Date().setFullYear(new Date().getFullYear() + 10))).format('YYYY');
  profile_id: any;
  constructor(
    private modalService: BsModalService,
    private commonServcie: CommonService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private confirmationService: ConfirmationService,
    private countryService: CountryService) {

    this.spinner.show();

    // Copy post links functions
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
    // this.subscriptionList.forEach(ele => {


    // Service calling for suggetion
    this.suggestion().then((res: any) => {
      this.profile_id = res.profile_id;

      res.subscription_list.forEach(element => {
        this.subscriptionList.push({ id: element });
      });
      this.onDownloadMedia(res.profile_picture).then(image => {
        this.loggedUserImage = image;
      })
      this.subscriberUserID = res.user_id;
      this.subscriberUsername = res.profile_url;
    }).then(res1 => {
      this.commonServcie.account_list('creator', { profile_ids: '' }).subscribe((profiles: any) => {
        let pid = this.profile_id;
        this.SuggestionPopup = true;
        var arr = _.remove(profiles, function (n) {
          if (n.profile_id !== pid) {
            return n;
          }
        });


        if (this.subscriptionList.length > 0) {
          if (arr) {
            arr.forEach(e => {

              this.onDownloadMedia(e.profile_picture).then(res => {
                e.profile_picture = res;

              }).then(res => {
                if (this.profiles.length == 0) {
                  let check = _.find(this.subscriptionList, { 'id': e.profile_id });
                  if (check === undefined) {
                    this.profiles.push(e);
                  }

                } else {
                  let check = _.find(this.subscriptionList, { 'id': e.profile_id });
                  if (check === undefined) {
                    this.profiles.push(e);
                  }
                }

              });
            })
          }
        }
        else {
          arr.forEach(e => {
            this.onDownloadMedia(e.profile_picture).then(res => {
              e.profile_picture = res;
            }).then(res => {
              let id = this.profile_id;
              let check = _.isMatch(e, { profile_id: id });
              console.log('check=>', check, e, id);

              if (check === false) {
                this.profiles.push(e);
              }
              ;
            })
          })
        }


      });
    });



    // calling feed function
    this.feed();


    // add country list to purchase popup
    this.countryService.country.forEach(e => {
      this.countryList.push({ label: e, value: e },)
    });


    // call function which gives decoded token
    this.userDetails = this.commonServcie.getLoggedUserDetail();

    //check which type of user is logged in
    if (this.userDetails['cognito:groups'][0] === 'Creator') {
      this.isCreator = true;
    } else {
      this.isSubscriber = true;
    }

    this.spinner.hide();
  }

  ngOnInit() { }

  // function for successfully copied link
  onSuccess(e) {
    if (e.text !== '') {
      this.copiedText = e.text;
      this.toastr.success('Link copied to clipboard.');
    }
  }


  // Lazy loading when user continously scroll home page
  onScroll() {
    this.postSkip = this.postSkip + this.postLimit;
    this.packSkip = this.packSkip + this.packLimit;
    this.productSkip = this.productSkip + this.productLimit;
    this.exclusiveSkip = this.exclusiveSkip + this.exclusiveLimit;

    this.commonServcie.getFeedPost(this.postSkip, this.postLimit).subscribe((feedPost: any) => {
      if (feedPost) {
        this.postData = feedPost.resp;
        if (feedPost.resp.posts.length > 0) {
          this.postData.forEach(element => {
            if (element.posts.length > 0) {
              this.isPOST = true;
              element.posts.forEach((e, index) => {

                this.onDownloadMedia(element.profile_picture).then(res => {
                  e.profileImage = res;
                });
                e.userName = element.profile_url;
                e.displayName = element.display_name;
                e.user_id = element.user_id;

                if (e.tags.length > 0) {
                  e.tag = true;
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

                e.link = element.profile_url + '/post/' + e.post_id;
                let dt1 = this.commonServcie.scheduleDate(e.publish_date);
                e.publish_date = moment(dt1, 'YYYY-MM-DD').format();
                e.date = moment(dt1, 'YYYY-MM-DD').format('MMM DD');


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
                if (e.score >= 90 && e.score <= 95) {
                  e.is90 = true;
                }
                if (e.score >= 70 && e.score <= 89) {
                  e.is80 = true;
                }
                if (e.score >= 46 && e.score <= 69) {
                  e.is70 = true;
                }
                if (e.score <= 45) {
                  e.is60 = true;
                }

                if (e.comments === true && e.total_comments) {

                  this.commonServcie.get_comments_post(e.post_id, this.start, this.limit).subscribe((res: any) => {

                    if (res.length > 0) {
                      e.commentArr = res;
                      e.commentArr.forEach(ele => {

                        ele.isModify = false;
                        ele.isDelete = false;
                        ele.isLike = false;
                        this.onDownloadMedia(ele.profile[0].profile_picture).then(image => {
                          ele.profile[0].profile_picture = image;
                        });
                        let dt = this.commonServcie.scheduleDate(ele.created_date);
                        let dt1 = this.commonServcie.scheduleTime(ele.created_date);
                        let dt2 = dt + ' ' + dt1;
                        const date = moment(dt2, 'YYYY-MM-DD hh:mm:ss ').format('MMM Do  HH:MMA');
                        ele.created_date = date;
                        ele.replaytoComment = false;

                        if (ele.total_replays > 0) {
                          this.commonServcie.get_reply(ele.comment_uid, 0, 5).subscribe(res => {
                            ele.reply = res;
                            ele.reply.forEach(e => {
                              let dt = this.commonServcie.scheduleDate(e.created_date);
                              let dt1 = this.commonServcie.scheduleTime(e.created_date);
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
                }

                e.id = e.post_id;
                e.category = e.post_category;
                e.created_date = e.publish_date;
                e.type = 'post';
                this.FinalArray.push(e);
                this.postLength = this.postLength++;
              });
            } else {
              this.isPOST = false;
            }
          });
        }


        //pack
        this.commonServcie.getFeedPack(this.packSkip, this.packLimit).subscribe((feedPack: any) => {
          this.packData = feedPack.resp;
          if (feedPack) {
            if (feedPack.resp.packs.length > 0) {
              this.packData.forEach(element => {
                if (element.packs.length > 0) {
                  this.isPACK = true;
                  element.packs.forEach(e => {

                    this.onDownloadMedia(element.profile_picture).then((img: any) => {
                      e.profileImage = img;
                    });

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
                          this.onDownloadMedia(element).then(res => {
                            medias.image.push(res);
                          })
                        } else {
                          this.onDownloadMedia(element).then(res => {
                            medias.video.push(res);
                          })
                        }
                        e['medias'] = medias;
                      });
                    }

                    e.link = element.profile_url + '/pack/' + e.pack_id;

                    if (e.publish_date !== null) {
                      let dt1 = this.commonServcie.scheduleDate(e.publish_date);
                      e.publish_date = moment(dt1, 'YYYY-MM-DD').format();
                      e.date = moment(dt1, 'YYYY-MM-DD').format('MMM DD');

                    } else {
                      e['date'] = '-';
                    }


                    e.userName = element.profile_url;
                    e.displayName = element.display_name;
                    e.user_id = element.user_id;
                    if (e.purchase[0]) {
                      e.isPurchase = true;
                      let dt1 = this.commonServcie.scheduleDate(e.purchase[0].created_at);
                      e.pdate = moment(dt1, 'YYYY-MM-DD').format('MMM Do');
                    } else { }

                    e.created_date = e.publish_date;
                    e.media = e.preview_media;
                    e.medias = e.medias;
                    e.modified_date = e.modified_on;
                    e.type = 'pack';
                    e.category = e.pack_category;
                    e.id = e.pack_id;

                    this.FinalArray.push(e);
                    this.packLength = this.packLength++;
                  });

                } else {
                  this.isPACK = false;
                }
              });
            }

            // prod

            this.commonServcie.getFeedProduct(this.productSkip, this.productLimit).subscribe((feedProd: any) => {
              if (feedProd) {
                this.productData = feedProd.resp;
                if (feedPack.resp.products.length > 0) {
                  this.productData.forEach(element => {
                    if (element.products.length > 0) {
                      this.isPRODUCT = true;
                      element.products.forEach(e => {

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
                              this.onDownloadMedia(element).then(res => {
                                medias.image.push(res);
                              })
                            } else {
                              this.onDownloadMedia(element).then(res => {
                                medias.video.push(res);
                              })
                            }
                            e['medias'] = medias;
                          });
                        }

                        if (e.product_tags.length > 0) {
                          e.tag = true;
                        }

                        this.onDownloadMedia(element.profile_picture).then(img1 => {
                          e.profileImage = img1;
                        });
                        e.userName = element.profile_url;
                        e.displayName = element.display_name;
                        e.user_id = element.user_id;
                        e.link = element.profile_url + '/product/' + e.product_id;
                        let dt1 = this.commonServcie.scheduleDate(e.created_at);
                        e.created_at = moment(dt1, 'YYYY-MM-DD').format();
                        e.date = moment(dt1, 'YYYY-MM-DD').format('MMM DD');


                        if (e.purchase[0]) {
                          e.isPurchase = true;
                          let dt1 = this.commonServcie.scheduleDate(e.purchase[0].created_at);
                          e.pdate = moment(dt1, 'YYYY-MM-DD').format('MMM Do');
                        } else { }

                        e.type = 'product'
                        e.description = e.product_description;
                        e.title = e.product_name;
                        e.tags = e.product_tags;
                        e.media = e.product_image;
                        e.modified_date = e.modified_on;
                        e.category = e.product_category;
                        e.id = e.product_id;
                        this.FinalArray.push(e);
                        this.productLength = this.productLength++;
                      });
                    } else {
                      this.isPRODUCT = false;
                    }
                  });


                }

              }

              // exclusive

              this.commonServcie.getFeedExclusive(this.exclusiveSkip, this.exclusiveLimit).subscribe((feedExclusive: any) => {

                if (feedExclusive) {
                  this.exclusiveData = feedExclusive.resp;
                  if (feedExclusive.resp.exclusives.length > 0) {
                    this.exclusiveData.forEach(element => {
                      if (element.exclusives.length > 0) {
                        this.isEXCLUSIVE = true;
                        element.exclusives.forEach(e => {

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
                                this.onDownloadMedia(element).then(res => {
                                  medias.image.push(res);
                                })
                              } else {
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
                                this.onDownloadMedia(element).then(res => {
                                  medias.image.push(res);
                                })
                              } else {
                                this.onDownloadMedia(element).then(res => {
                                  medias.video.push(res);
                                })
                              }
                              e['medias'] = medias;
                            });
                          }
                          if (e.goal > e.amount_contributed) {
                            e.isContribute = true;
                          } else {
                            e.isContribute = false;
                          }

                          this.onDownloadMedia(element.profile_picture).then(img2 => {
                            e.profileImage = img2;
                          });
                          e.userName = element.profile_url;
                          e.displayName = element.display_name;
                          e.user_id = element.user_id;
                          e.link = element.profile_url + '/exclusive/' + e.exclusive_id;
                          let dt1 = this.commonServcie.scheduleDate(e.created_on);
                          e.created_on = moment(dt1, 'YYYY-MM-DD').format();
                          e.date = moment(dt1, 'YYYY-MM-DD').format('MMM DD');

                          if (e.purchase[0]) {
                            e.isPurchase = true;
                            let dt1 = this.commonServcie.scheduleDate(e.purchase[0].created_at);
                            e.pdate = moment(dt1, 'YYYY-MM-DD').format('MMM Do');
                          } else { }

                          e.type = 'exclusive';
                          e.price = e.min_contribution;
                          e.modified_date = e.modified_on;
                          e.category = e.exclusive_category;
                          e.id = e.exclusive_id;
                          e.media = e.exclusive_content;
                          e.created_date = e.created_on;
                          this.FinalArray.push(e);
                          this.exclusiveLength = this.exclusiveLength++;
                        });

                      } else {
                        this.isEXCLUSIVE = false;
                      }
                    });


                  }

                }


                this.FinalArray.sort((a, b) => {
                  const c = new Date(a.created_date).getTime();
                  const d = new Date(b.created_date).getTime();
                  return d - c;
                });
              }, err => {

              });

            }, err => {

            });

          }

        }, err => {

        });

      }


    }, err => {

    });
  }

  // for view more suggetions
  viewMore() {

  }

  // function for error while copied link
  onError(e) {
    this.copiedText = 'Error trying to copy post link';
  }

  // function for creating form control
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

  // function for new card form control
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


  // function for feed
  feed() {
    this.commonServcie.getFeedPost(this.postSkip, this.postLimit).subscribe((feedPost: any) => {
      if (feedPost) {
        this.postData = feedPost.resp;
        this.postData.forEach(element => {
          if (element.posts.length > 0) {
            this.isPOST = true;
            element.posts.forEach(e => {

              this.onDownloadMedia(element.profile_picture).then(res => {
                e.profileImage = res;
              });
              e.userName = element.profile_url;
              e.displayName = element.display_name;
              e.user_id = element.user_id;

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

              e.link = "http://mi.show/" + element.profile_url + '/post/' + e.post_id;
              let dt1 = this.commonServcie.scheduleDate(e.publish_date);
              e.publish_date = moment(dt1, 'YYYY-MM-DD').format();
              e.date = moment(dt1, 'YYYY-MM-DD').format('MMM DD');


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
              if (e.score >= 90 && e.score <= 95) {
                e.is90 = true;
              }
              if (e.score >= 70 && e.score <= 89) {
                e.is80 = true;
              }
              if (e.score >= 46 && e.score <= 69) {
                e.is70 = true;
              }
              if (e.score <= 45) {
                e.is60 = true;
              }



              e.id = e.post_id;
              e.category = e.post_category;
              e.created_date = e.publish_date;
              e.type = 'post';
              this.FinalArray.push(e);
              this.postLength = this.postLength + 1;
            });




          } else {
            this.isPOST = false;
          }
        });
      }

      // pack
      this.commonServcie.getFeedPack(this.packSkip, this.packLimit).subscribe((feedPack: any) => {
        this.packData = feedPack.resp;
        if (feedPack) {

          this.packData.forEach(element => {
            if (element.packs.length > 0) {
              this.isPACK = true;
              element.packs.forEach(e => {

                this.onDownloadMedia(element.profile_picture).then((img: any) => {
                  e.profileImage = img;
                });

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
                      this.onDownloadMedia(element).then(res => {
                        medias.image.push(res);
                      })
                    } else {
                      this.onDownloadMedia(element).then(res => {
                        medias.video.push(res);
                      })
                    }
                    e['medias'] = medias;
                  });
                }

                e.link = "http://mi.show/" + element.profile_url + '/pack/' + e.pack_id;

                if (e.publish_date !== null) {
                  let dt1 = this.commonServcie.scheduleDate(e.publish_date);
                  e.publish_date = moment(dt1, 'YYYY-MM-DD').format();
                  e.date = moment(dt1, 'YYYY-MM-DD').format('MMM DD');

                } else {
                  e['date'] = '-';
                }


                e.userName = element.profile_url;
                e.displayName = element.display_name;
                e.user_id = element.user_id;
                if (e.purchase[0]) {
                  e.isPurchase = true;
                  let dt1 = this.commonServcie.scheduleDate(e.purchase[0].created_at);
                  e.pdate = moment(dt1, 'YYYY-MM-DD').format('MMM Do');
                } else { }

                e.created_date = e.publish_date;
                e.media = e.preview_media;
                e.medias = e.medias;
                e.modified_date = e.modified_on;
                e.type = 'pack';
                e.category = e.pack_category;
                e.id = e.pack_id;

                this.FinalArray.push(e);
                this.packLength = this.packLength + 1;
              });

            } else {
              this.isPACK = false;
            }
          });
        }

        // prod
        this.commonServcie.getFeedProduct(this.productSkip, this.productLimit).subscribe((feedProd: any) => {
          if (feedProd) {
            this.productData = feedProd.resp;
            this.productData.forEach(element => {
              if (element.products.length > 0) {
                this.isPRODUCT = true;
                element.products.forEach(e => {

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
                        this.onDownloadMedia(element).then(res => {
                          medias.image.push(res);
                        })
                      } else {
                        this.onDownloadMedia(element).then(res => {
                          medias.video.push(res);
                        })
                      }
                      e['medias'] = medias;
                    });
                  }

                  if (e.product_tags.length > 0) {
                    e.tag = true;
                  }

                  this.onDownloadMedia(element.profile_picture).then(img1 => {
                    e.profileImage = img1;
                  });
                  e.userName = element.profile_url;
                  e.displayName = element.display_name;
                  e.user_id = element.user_id;
                  e.link = "http://mi.show/" + element.profile_url + '/product/' + e.product_id;
                  let dt1 = this.commonServcie.scheduleDate(e.created_at);
                  e.created_at = moment(dt1, 'YYYY-MM-DD').format();
                  e.date = moment(dt1, 'YYYY-MM-DD').format('MMM DD');


                  if (e.purchase[0]) {
                    e.isPurchases = true;
                    let dt1 = this.commonServcie.scheduleDate(e.purchase[0].created_at);
                    e.pdate = moment(dt1, 'YYYY-MM-DD').format('MMM Do');
                  } else { }
                  if (e.purchase[0]) {
                    e.isPurchase = e.isPurchases;
                  }
                  e.type = 'product';
                  e.description = e.product_description;
                  e.title = e.product_name;
                  e.tags = e.product_tags;
                  e.media = e.product_image;
                  e.modified_date = e.modified_on;
                  e.category = e.product_category;
                  e.created_date = e.created_at;
                  e.id = e.product_id;
                  this.FinalArray.push(e);
                  this.productLength = this.productLength + 1;
                });
              } else {
                this.isPRODUCT = false;
              }
            });
          }

          // exclusive

          this.commonServcie.getFeedExclusive(this.exclusiveSkip, this.exclusiveLimit).subscribe((feedExclusive: any) => {

            if (feedExclusive) {
              this.exclusiveData = feedExclusive.resp;
              this.exclusiveData.forEach(element => {
                if (element.exclusives.length > 0) {
                  this.isEXCLUSIVE = true;
                  element.exclusives.forEach(e => {

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
                          this.onDownloadMedia(element).then(res => {
                            medias.image.push(res);
                          })
                        } else {
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
                          this.onDownloadMedia(element).then(res => {
                            medias.image.push(res);
                          })
                        } else {
                          this.onDownloadMedia(element).then(res => {
                            medias.video.push(res);
                          })
                        }
                        e['medias'] = medias;
                      });
                    }
                    if (e.goal > e.amount_contributed) {
                      e.isContribute = true;
                    } else {
                      e.isContribute = false;
                    }

                    this.onDownloadMedia(element.profile_picture).then(img2 => {
                      e.profileImage = img2;
                    });
                    e.userName = element.profile_url;
                    e.displayName = element.display_name;
                    e.user_id = element.user_id;
                    e.link = "http://mi.show/" + element.profile_url + '/exclusive/' + e.exclusive_id;
                    let dt1 = this.commonServcie.scheduleDate(e.created_on);
                    e.created_on = moment(dt1, 'YYYY-MM-DD').format();
                    e.date = moment(dt1, 'YYYY-MM-DD').format('MMM DD');

                    if (e.purchase[0]) {
                      e.isPurchases = true;
                      let dt1 = this.commonServcie.scheduleDate(e.purchase[0].created_at);
                      e.pdate = moment(dt1, 'YYYY-MM-DD').format('MMM Do');
                    } else { }
                    if (e.purchase[0]) {
                      e.isPurchase = e.isPurchases
                    }

                    e.type = 'exclusive';
                    e.price = e.min_contribution;
                    e.modified_date = e.modified_on;
                    e.category = e.exclusive_category;
                    e.id = e.exclusive_id;
                    e.media = e.exclusive_content;
                    e.created_date = e.created_on;
                    this.FinalArray.push(e);
                    this.exclusiveLength = this.exclusiveLength + 1;

                  });

                } else {
                  this.isEXCLUSIVE = false;
                }
              });


            }


            if ((this.postLength + this.packLength + this.productLength + this.exclusiveLength) === this.FinalArray.length) {
              console.log('inn=======>');

              this.FinalArray.sort((a, b) => {
                const c = new Date(a.created_date).getTime();
                const d = new Date(b.created_date).getTime();
                return d - c;
              });
            }

          }, err => {

          });

        }, err => {

        });



      }, err => {

      });
    }, err => {

    });
  }


  // fumction for open popup
  open(temp, arr) {
    this.modalRef = this.modalService.show(temp, { class: 'MediaPopup modal-lg' });
    this.mediaImages = arr;
    this.postId = arr.post_id;
  }

  // function for downloading media files
  async onDownloadMedia(files) {
    return new Promise((pass, fail) => {
      this.commonServcie.getDownloadPresignURL('download', files).subscribe((data: any) => {
        if (data.url) {
          pass(data.url);
        }
      });
    });
  }

  // function for liking comment
  likeComment(arr) {
    this.spinner.show();
    this.commonServcie.like_comment(arr.comment_uid).subscribe(res => {
      this.toastr.success('Like  the comment!');
      this.NotificationID = arr.post_id;
      let obj = {
        event_type: 'NEW_LIKE',
        user_id: this.userID,
        message: 'New like  from  ' + this.subscriberUsername,
        hyperlink: "post/" + this.NotificationID,
        from_info: {
          display_name: this.subscriberName,
          profile_url: this.subscriberUsername,
          user_id: this.subscriberUserID
        }
      }
      this.commonServcie.creator_notification(obj).subscribe((res: any) => { })
      arr.isLike = true;
      arr.total_likes = arr.total_likes + 1;
      arr.you_liked = true;
      this.commonServcie.user_log({ message: 'User like the comment successfully!' }).subscribe(res => { });
      this.spinner.hide();
    }, err => {
      this.toastr.error(err.error.message);
      this.spinner.hide();
    });
  }


  // function for unliking comment
  unlikeComment(arr) {
    this.spinner.show();
    if (arr.you_liked === true) {
      this.commonServcie.unlike_comment(arr.comment_uid).subscribe(res => {
        this.toastr.success('unlike the comment!');

        arr.isLike = false;
        arr.total_likes = arr.total_likes - 1;
        arr.you_liked = false;
        this.commonServcie.user_log({ message: 'User inlike the comment successfully!' }).subscribe(res => { });
        this.spinner.hide();
      }, err => {
        this.toastr.error(err.error.message);
        this.spinner.hide();
      });
    } else {
      this.toastr.warning('Sorry you did not like this comment!');
    }

  }


  // function for when user click on reply comment button
  reply(arr) {
    this.commentID = arr;
    arr.replaytoComment = true;
  }


  // function for when user add , modify or reply the comment
  AddComment(key, id, cmt) {
    this.spinner.show();
    if (key === 'modify') {
      let obj = {
        comment_uid: cmt,
        comment: this.comment
      }
      this.commonServcie.update_comment(obj).subscribe(res => {
        this.commonServcie.get_comments_post(id.post_id, 0, 5).subscribe((res: any) => {

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
              let dt = this.commonServcie.scheduleDate(ele.created_date);
              let dt1 = this.commonServcie.scheduleTime(ele.created_date);
              let dt2 = dt + ' ' + dt1;
              const date = moment(dt2, 'YYYY-MM-DD hh:mm:ss ').format('MMM Do  HH:MMA');
              ele.created_date = date;
              ele.replaytoComment = false;

              if (ele.total_replays > 0) {
                this.commonServcie.get_reply(ele.comment_uid, 0, 5).subscribe(res => {
                  ele.reply = res;
                  ele.reply.forEach(e => {
                    let dt = this.commonServcie.scheduleDate(e.created_date);
                    let dt1 = this.commonServcie.scheduleTime(e.created_date);
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
      this.NotificationID = id.post_id;
      this.commonServcie.comment(obj).subscribe(res => {
        this.commonServcie.get_comments_post(id.post_id, 0, 5).subscribe((res: any) => {

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
              let dt = this.commonServcie.scheduleDate(ele.created_date);
              let dt1 = this.commonServcie.scheduleTime(ele.created_date);
              let dt2 = dt + ' ' + dt1;
              const date = moment(dt2, 'YYYY-MM-DD hh:mm:ss ').format('MMM Do  HH:MMA');
              ele.created_date = date;
              ele.replaytoComment = false;

              if (ele.total_replays > 0) {
                this.commonServcie.get_reply(ele.comment_uid, 0, 5).subscribe(res => {
                  ele.reply = res;
                  ele.reply.forEach(e => {
                    let dt = this.commonServcie.scheduleDate(e.created_date);
                    let dt1 = this.commonServcie.scheduleTime(e.created_date);
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
          user_id: id.user_id,
          message: 'New comment from ' + this.subscriberUsername + '.',
          hyperlink: "post/" + this.NotificationID,
          from_info: {
            display_name: this.subscriberName,
            profile_url: this.subscriberUsername,
            user_id: this.subscriberUserID
          }

        }
        this.commonServcie.creator_notification(obj).subscribe((res: any) => { })
        this.toastr.success('Commented successfully.');
        this.spinner.hide();
        this.commonServcie.user_log({ message: 'User commneted post successfully!' }).subscribe(res => { });
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.message);
      });
    } else if (key === 'reply') {


      let obj = {
        post_id: this.commentID.post_id,
        comment: this.comment
      }
      this.commonServcie.reply_comment(this.commentID.comment_uid, obj).subscribe(res => {
        this.NotificationID = id.post_id;
        this.commonServcie.get_comments_post(id.post_id, 0, 5).subscribe((res: any) => {

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
              let dt = this.commonServcie.scheduleDate(ele.created_date);
              let dt1 = this.commonServcie.scheduleTime(ele.created_date);
              let dt2 = dt + ' ' + dt1;
              const date = moment(dt2, 'YYYY-MM-DD hh:mm:ss ').format('MMM Do  HH:MMA');
              ele.created_date = date;
              ele.replaytoComment = false;

              if (ele.total_replays > 0) {
                this.commonServcie.get_reply(ele.comment_uid, 0, 5).subscribe(res => {
                  ele.reply = res;
                  ele.reply.forEach(e => {
                    let dt = this.commonServcie.scheduleDate(e.created_date);
                    let dt1 = this.commonServcie.scheduleTime(e.created_date);
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
          event_type: 'New comment reply',
          user_id: id.user_id,
          message: 'Reply from ' + this.subscriberUsername + ' on your comment.',
          hyperlink: "/post/" + this.NotificationID,
          from_info: {
            display_name: this.subscriberName,
            profile_url: this.subscriberUsername,
            user_id: this.subscriberUserID
          }

        }

        this.commonServcie.creator_notification(obj).subscribe((res: any) => { })
        this.toastr.success('Reply sent successfully.');
        this.commonServcie.user_log({ message: 'Userreply to comment successfully!' }).subscribe(res => { });
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.message);
      });
    }

  }


  // while user click update comment button
  updateComment(arr) {
    this.commentArr = arr;
    arr.isModify = true;
  }

  // blur event of comment textbox
  onComment(e) {
    this.comment = e.target.value;
  }

  // function for load comments
  LoadComments(arr) {
    if (arr.comments === true && arr.total_comments) {

      this.commonServcie.get_comments_post(arr.post_id, this.start, this.limit).subscribe((res: any) => {

        if (res.length > 0) {
          arr.commentArr = res;
          arr.commentArr.forEach(ele => {

            ele.isModify = false;
            ele.isDelete = false;
            ele.isLike = false;
            this.onDownloadMedia(ele.profile[0].profile_picture).then(image => {
              ele.profile[0].profile_picture = image;
            });
            let dt = this.commonServcie.scheduleDate(ele.created_date);
            let dt1 = this.commonServcie.scheduleTime(ele.created_date);
            let dt2 = dt + ' ' + dt1;
            const date = moment(dt2, 'YYYY-MM-DD hh:mm:ss ').format('MMM Do  HH:MMA');
            ele.created_date = date;
            ele.replaytoComment = false;

            if (ele.total_replays > 0) {
              this.commonServcie.get_reply(ele.comment_uid, 0, 5).subscribe(res => {
                ele.reply = res;
                ele.reply.forEach(e => {
                  let dt = this.commonServcie.scheduleDate(e.created_date);
                  let dt1 = this.commonServcie.scheduleTime(e.created_date);
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
    }
  }

  // function for votion
  Voting(vote, id) {

    // this.spinner.show();
    if (vote === '10') {
      let obj = {
        post_id: id.post_id,
        vote: 'ten'
      }
      this.commonServcie.voting(obj).subscribe(res => {
        this.toastr.success('Voted successfully.');
        this.commonServcie.user_log({ message: 'You rated this post.' }).subscribe(res => { });
        this.commonServcie.get_post_id(id.post_id).subscribe((post: any) => {
          this.commonServcie.getAllVotes(id.post_id).subscribe((vote: any) => {
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
        // this.spinner.hide();
      }, err => {

        this.toastr.error(err.error.message);
      });
    }
    if (vote === '9') {

      let obj = {
        post_id: id.post_id,
        vote: 'nine'
      }
      this.commonServcie.voting(obj).subscribe(res => {
        this.toastr.success('Voted successfully.');
        this.commonServcie.user_log({ message: 'You rated this post.' }).subscribe(res => { });
        this.commonServcie.get_post_id(id.post_id).subscribe((post: any) => {
          this.commonServcie.getAllVotes(id.post_id).subscribe((vote: any) => {
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

      }, err => {

        this.toastr.error(err.error.message);
      })
    }
    if (vote === '8') {

      let obj = {
        post_id: id.post_id,
        vote: 'eight'
      }
      this.commonServcie.voting(obj).subscribe(res => {
        this.toastr.success('Voted successfully.');
        this.commonServcie.user_log({ message: 'You rated this post.' }).subscribe(res => { });

        this.commonServcie.get_post_id(id.post_id).subscribe((post: any) => {
          this.commonServcie.getAllVotes(id.post_id).subscribe((vote: any) => {
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

      }, err => {

        this.toastr.error(err.error.message);
      })
    }
    if (vote === '7') {

      let obj = {
        post_id: id.post_id,
        vote: 'seven'
      }
      this.commonServcie.voting(obj).subscribe(res => {
        this.toastr.success('Voted successfully.');
        this.commonServcie.user_log({ message: 'You rated this post.' }).subscribe(res => { });

        this.commonServcie.get_post_id(id.post_id).subscribe((post: any) => {
          this.commonServcie.getAllVotes(id.post_id).subscribe((vote: any) => {
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

      }, err => {

        this.toastr.error(err.error.message);
      })
    }
    if (vote === '6') {

      let obj = {
        post_id: id.post_id,
        vote: 'six'
      }
      this.commonServcie.voting(obj).subscribe(res => {
        this.toastr.success('Voted successfully.');
        this.commonServcie.user_log({ message: 'You rated this post.' }).subscribe(res => { });

        this.commonServcie.get_post_id(id.post_id).subscribe((post: any) => {
          this.commonServcie.getAllVotes(id.post_id).subscribe((vote: any) => {
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

      }, err => {

        this.toastr.error(err.error.message);
      });
    }
  }


  // function for deleting comment
  deleteComment(key, post, arr, replyArr) {
    // this.spinner.show();

    this.confirmationService.confirm({
      message: 'Are you sure  you want to Delete?',
      accept: () => {

        if (key === 'comment') {

          this.commonServcie.delete_comments(arr.comment_uid, 0, 5).subscribe(res => {
            this.toastr.success('Comment Deleted Successfully!');
            this.commonServcie.user_log({ message: 'User deleted commnent successfully!' }).subscribe(res => { });
            this.spinner.hide();
            this.commonServcie.get_comments_post(post.post_id, 0, 5).subscribe((res: any) => {

              if (res.length > 0) {
                post.commentArr = res;
                post.commentArr.forEach(ele => {

                  ele.isModify = false;
                  ele.isDelete = false;
                  ele.isLike = false;
                  this.onDownloadMedia(ele.profile[0].profile_picture).then(image => {
                    ele.profile[0].profile_picture = image;
                  });
                  let dt = this.commonServcie.scheduleDate(ele.created_date);
                  let dt1 = this.commonServcie.scheduleTime(ele.created_date);
                  let dt2 = dt + ' ' + dt1;
                  const date = moment(dt2, 'YYYY-MM-DD hh:mm:ss ').format('MMM Do  HH:MMA');
                  ele.created_date = date;
                  ele.replaytoComment = false;

                  if (ele.total_replays > 0) {
                    this.commonServcie.get_reply(ele.comment_uid, 0, 5).subscribe(res => {
                      ele.reply = res;
                      ele.reply.forEach(e => {
                        let dt = this.commonServcie.scheduleDate(e.created_date);
                        let dt1 = this.commonServcie.scheduleTime(e.created_date);
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

          }, err => {
            this.spinner.hide();
            this.toastr.error(err.error.message);
          })
        } else if (key === 'reply') {
          this.commonServcie.delete_reply(arr.comment_uid, replyArr.comment_uid).subscribe(res => {

            // replyArr.isDelete = true;
            this.toastr.success('Reply Deleted Successfully!');
            this.commonServcie.user_log({ message: 'User deleted reply successfully!' }).subscribe(res => { });
            this.commonServcie.get_comments_post(post.post_id, 0, 5).subscribe((res: any) => {

              if (res.length > 0) {
                post.commentArr = res;
                post.commentArr.forEach(ele => {

                  ele.isModify = false;
                  ele.isDelete = false;
                  ele.isLike = false;
                  this.onDownloadMedia(ele.profile[0].profile_picture).then(image => {
                    ele.profile[0].profile_picture = image;
                  });
                  let dt = this.commonServcie.scheduleDate(ele.created_date);
                  let dt1 = this.commonServcie.scheduleTime(ele.created_date);
                  let dt2 = dt + ' ' + dt1;
                  const date = moment(dt2, 'YYYY-MM-DD hh:mm:ss ').format('MMM Do  HH:MMA');
                  ele.created_date = date;
                  ele.replaytoComment = false;

                  if (ele.total_replays > 0) {
                    this.commonServcie.get_reply(ele.comment_uid, 0, 5).subscribe(res => {
                      ele.reply = res;
                      ele.reply.forEach(e => {
                        let dt = this.commonServcie.scheduleDate(e.created_date);
                        let dt1 = this.commonServcie.scheduleTime(e.created_date);
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
            this.spinner.hide();
          }, err => {
            this.spinner.hide();
            this.toastr.error(err.error.message);
          })
        }
      }
    });
  }

  // when clicking on plus icon while purchasing product
  plus() {
    this.quantity++;
    this.remainingQuantity--;
    this.productCost = this.quantity * this.originalCost;
    this.commonServcie.addTaxes(this.userID, this.state, this.payType, this.productCost, { 'revenue_sharing': [] }).subscribe((taxes: any) => {
      this.taxes = taxes;
      this.isTaxShow = true;
      this.basicTotal = taxes.item_subtotal;
      this.finalTotal = taxes.total_payment;
      this.taxesAmount = taxes.card_transaction_fee + taxes.state_taxes + taxes.platform_fee_subscriber;
    })
    if (this.remainingQuantity > 1) {
      this.isAvailQuantity = false;
    } else {
      this.isAvailQuantity = true;
    }
  }


  // when clicking on minus icon while purchasing product
  minus() {
    if (this.quantity > 1) {
      this.quantity--;
      this.remainingQuantity++;
      this.productCost = this.quantity * this.originalCost;
      this.commonServcie.addTaxes(this.userID, this.state, this.payType, this.productCost, { 'revenue_sharing': [] }).subscribe((taxes: any) => {
        this.taxes = taxes;
        this.isTaxShow = true;
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

  //when try to buy Pack, Product or Exclusive
  Buy(arr, temp) {
    this.spinner.show();
    this.userID = arr.user_id;

    this.commonServcie.getUserDetails(this.userID).subscribe((res: any) => {
      this.userName = res.user_name;
    });
    this.contributionValue = [];
    this.contributionsList = [];
    this.savedCard = [];
    if (arr.type === 'pack') {
      this.isPackPurchase = true;
      this.isProductPurchase = false;
      this.isExclusivePurchase = false;
      this.packCost = arr.price;
      this.title = arr.title;
      this.button = 'Purchase';
      this.taxID = arr.price;

      this.payType = arr.type;
      this.payDescription = arr.description;
      this.payAssetID = arr.id;
      this.payQuantity = 1;
      this.payAmount = arr.price;

    }
    if (arr.type === 'product') {
      this.isPackPurchase = false;
      this.isProductPurchase = true;
      this.isExclusivePurchase = false;
      this.title = arr.title;
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
      this.payType = arr.type;
      this.payDescription = arr.description;
      this.payAssetID = arr.id;

    }

    if (arr.type === 'exclusive') {
      this.isPackPurchase = false;
      this.isProductPurchase = false;
      this.isExclusivePurchase = true;
      this.title = arr.title;
      this.button = 'Contribute';
      this.exclusiveID = arr.id;
      this.payType = arr.type;
      this.payDescription = 'contribution';
      this.payAssetID = arr.id;
      this.payQuantity = 1;
      let goal = arr.goal;
      let l1 = arr.price;
      let l2 = arr.price;
      this.contributionsList.push({ label: 'Select any one', value: '' })
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

    this.commonServcie.getCardDetail().subscribe((res: any) => {
      this.state = res.profile.shipToList[0].state;
      this.commonServcie.addTaxes(this.userID, res.profile.shipToList[0].state, arr.type, this.taxID, { 'revenue_sharing': [] }).subscribe((taxes: any) => {
        this.taxes = taxes;
        this.isTaxShow = true;
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


      } else {
        this.showSpinner = false;
        this.isCardDetails = false;
        // this.modalRef.hide();
        // this.modalRef = null;
        this.formInit();
        this.modalRef = this.modalService.show(temp, { class: ' CardDetailsPopup modal-lg' });
        this.spinner.hide();
      }
    }, err => {
      this.spinner.hide();
      this.showSpinner = false;

      this.modalRef = this.modalService.show(temp, { class: 'CardDetailsPopup modal-lg' });
      this.formInit();
      this.isCardDetails = false;
      // this.toastr.error(err.error[0]);
    });

  }

  // function for report any post
  report() {
    this.toastr.success('This post has been reported.');
  }


  // function for when user addede card for fisrt time
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
        this.commonServcie.cardDeatil(obj).subscribe((res: any) => {
          this.showSpinner = false;
          this.toastr.success('Card Detail Added successfully');
          this.commonServcie.user_log({ message: 'User added card detail successfully!' }).subscribe(res => { });
          if (this.payType === 'exclusive') {
            this.commonServcie.contribute({ exclusive_id: this.exclusiveID, contribution_amount: this.payAmount, transaction_id: res.transId }).subscribe(res => {
              this.toastr.success('Contributed Successfully');
              this.commonServcie.user_log({ message: 'User contributed successfully!' }).subscribe(res => { });
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


        this.commonServcie.cardDeatil(obj).subscribe((res: any) => {
          this.showSpinner = false;
          this.toastr.success('Card Detail Added successfully');
          this.commonServcie.user_log({ message: 'User added card detail successfully!' }).subscribe(res => { });
          if (this.payType === 'exclusive') {
            this.commonServcie.contribute({ exclusive_id: this.exclusiveID, contribution_amount: this.payAmount, transaction_id: res.transId }).subscribe(res => {
              this.toastr.success('Contributed Successfully');
              this.commonServcie.user_log({ message: 'User contributed successfully!' }).subscribe(res => { });
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
            this.commonServcie.creator_notification(obj).subscribe((res: any) => { })

          }


          if (this.payType === 'pack') {
            if (this.isSubscriber) {
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
            this.commonServcie.tip_comment(this.commentID.post_id, this.commentID.comment_uid, res.transId).subscribe(res => {

              this.toastr.success('Give tip to comment successfully');
              let obj = {
                event_type: 'NEW_TIP',
                user_id: this.userID,
                message: 'New tip from ' + this.subscriberUsername + ' on the Comment',
                hyperlink: "post/" + this.NotificationID,
                from_info: {
                  display_name: this.subscriberName,
                  profile_url: this.subscriberUsername,
                  user_id: this.subscriberUserID
                }
              }
              this.commonServcie.creator_notification(obj).subscribe((res: any) => { })
              this.commonServcie.user_log({ message: 'User Give tip to comment successfully!' }).subscribe(res => { });
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

  // function for when user pay with already added card
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
        this.showSpinner = true;

        this.commonServcie.cardDeatil(obj).subscribe((res: any) => {

          this.commonServcie.contribute({ exclusive_id: this.exclusiveID, contribution_amount: this.payAmount, transaction_id: res.transId }).subscribe(res => {
            this.toastr.success('Contributed Successfully');
            this.showSpinner = false;
            this.commonServcie.user_log({ message: 'User contributed successfully!' }).subscribe(res => { });
            this.modalRef.hide();
            this.modalRef = null;
            this.showCard = false;
            this.subscribeData = [];
            this.newCard.reset();
            this.submitted = false;
            this.contributionValue = [];
            this.contributionsList = [];
            this.savedCard = [];

            this.spinner.hide();
          }, err => {
            this.showSpinner = false;
            this.toastr.error(err.error.message);
          });


        }, err => {

          this.toastr.error(err.error);
          this.spinner.hide();
          this.modalRef.hide();
          this.modalRef = null;
          this.showSpinner = false;
        });
      }

    } else if (this.payType === 'product') {
      this.spinner.show();
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
      this.spinner.show();
      this.showSpinner = true;
      this.commonServcie.cardDeatil(obj).subscribe((res: any) => {
        this.showSpinner = false;
        // this.toastr.success('Card Detail Added successfully');



        if (this.payType === 'pack') {
          this.toastr.success('Pack Purchase Successfully.');

          if (this.isSubscriber) {
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

          this.spinner.hide();
        }




      }, err => {
        this.spinner.hide();
        this.showSpinner = false;
        this.toastr.error(err.error.message);
      });
    }


  }

  // function for when user added new card
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
        this.commonServcie.addnewShippingDetail(shipObj).subscribe(ship => { }, err => {
          this.toastr.error(err.error.message);
        });
        this.commonServcie.addNewDetails(obj).subscribe((newCard: any) => {
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
          this.commonServcie.user_log({ message: 'User added new card successfully!' }).subscribe(res => { });


          this.commonServcie.cardDeatil(pay).subscribe((card: any) => {
            if (this.payType === 'exclusive') {
              this.commonServcie.contribute({ exclusive_id: this.exclusiveID, contribution_amount: this.payAmount, transaction_id: card.transId }).subscribe(res => {
                this.toastr.success('Contributed Successfully');
                this.commonServcie.user_log({ message: 'User contributed successfully!' }).subscribe(res => { });
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

        this.commonServcie.addnewShippingDetail(shipObj).subscribe(ship => { }, err => {
          this.toastr.error(err.error.message);
        });


        this.commonServcie.addNewDetails(obj).subscribe((newCard: any) => {
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
            this.commonServcie.cardDeatil(pay).subscribe((card: any) => {

              this.toastr.success('Card Added successfully');
              this.commonServcie.user_log({ message: 'User added new card successfully!' }).subscribe(res => { });



              if (this.payType === 'pack') {
                if (this.isSubscriber) {
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

                this.spinner.hide();
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


  // function for when user buy the product
  buyProduct() {
    this.spinner.show();
    this.showSpinner = true;
    let time = moment(new Date()).format('YYYY-MM-DD-kk:mm:ss');
    if (this.purchaseWith === 'oldcard') {
      this.arr.push({
        [this.infoRequired]: this.information, 'username': this.userDetails.username,
        'created_at': time
      })
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
        notes: this.arr
      };
      // obj.notes[this.infoRequired] = this.information;
      console.log('obj=>', obj);

      this.commonServcie.cardDeatil(obj).subscribe((res: any) => {

        // this.toastr.success('Card Detail Added successfully');

        this.showSpinner = false;
        this.commonServcie.user_log({ message: 'User buy a product successfully!' }).subscribe(res => { });
        this.modalRef.hide();
        this.subscribeData = [];
        this.modalRef = null;
        this.savedCard = [];
        this.showCard = false;
        this.newCard.reset();
        this.submitted = false;
        this.toastr.success('Product purchase successfully!');


        this.commonServcie.modifyQty(this.payAssetID, this.payQuantity).subscribe(res => { })
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

      this.commonServcie.addnewShippingDetail(shipObj).subscribe(ship => { }, err => {
        this.toastr.error(err.error.message);
      });
      this.commonServcie.addNewDetails(obj1).subscribe((newCard: any) => {
        this.showSpinner = false;
        // this.toastr.success('Card Added successfully');
        this.commonServcie.user_log({ message: 'User added new card successfully!' }).subscribe(res => { });
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
            paymentProfileId: newCard.customerPaymentProfileId,
            notes: {
              'username': this.userDetails.username,
              'created_at': time
            },
          };
          pay.notes[this.infoRequired] = this.information;
          this.commonServcie.cardDeatil(pay).subscribe((card: any) => {

            this.commonServcie.modifyQty(this.payAssetID, this.payQuantity).subscribe(res => { })
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
      this.arr.push({
        [this.infoRequired]: this.information, 'username': this.userDetails.username,
        'created_at': time
      })
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
        }, notes: this.arr
      };

      // obj.notes[this.infoRequired] = this.information;
      this.commonServcie.cardDeatil(obj).subscribe((res: any) => {

        this.commonServcie.modifyQty(this.payAssetID, this.payQuantity).subscribe(res => { })
        this.showSpinner = false;
        // this.toastr.success('Card Detail Added successfully');
        this.commonServcie.user_log({ message: 'User added card detail successfully!' }).subscribe(res => { });

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

  // blur event of state textbox for counting tax
  taxCount(e) {

    this.commonServcie.addTaxes(this.userID, this.cardForm.value.state, this.payType, this.taxID, { 'revenue_sharing': [] }).subscribe((taxes: any) => {
      this.isTaxShow = true;
      this.taxes = taxes;

      this.basicTotal = taxes.item_subtotal;
      this.finalTotal = taxes.total_payment;
      this.taxesAmount = taxes.card_transaction_fee + taxes.state_taxes + taxes.platform_fee_subscriber;
      // this.spinner.hide();
    })
  }

  // function for closing popup
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

  // function for getting all user list for suggetion
  async suggestion() {
    return new Promise((pass, fail) => {
      this.commonServcie.get_profile().subscribe(file => {
        pass(file);
      }, err => {
        fail(err);
      });
    });
  }

  // functioin for load more comment
  loadMore(arr) {
    this.start = this.start + this.limit;
    this.commonServcie.get_comments_post(arr.post_id, this.start, this.limit).subscribe((res: any) => {

      if (res.length > 0) {
        arr.commentArr = res;
        arr.commentArr.forEach(ele => {

          ele.isModify = false;
          ele.isDelete = false;
          ele.isLike = false;

          let dt = this.commonServcie.scheduleDate(ele.created_date);
          let dt1 = this.commonServcie.scheduleTime(ele.created_date);
          let dt2 = dt + ' ' + dt1;
          const date = moment(dt2, 'YYYY-MM-DD hh:mm:ss ').format('MMM Do  HH:MMA');
          ele.created_date = date;
          ele.replaytoComment = false;
          this.onDownloadMedia(ele.profile[0].profile_picture).then(image => {
            ele.profile[0].profile_picture = image;
          });
          if (ele.total_replays > 0) {
            this.commonServcie.get_reply(ele.comment_uid, 0, 5).subscribe(res => {
              ele.reply = res;
              ele.reply.forEach(e => {
                let dt = this.commonServcie.scheduleDate(e.created_date);
                let dt1 = this.commonServcie.scheduleTime(e.created_date);
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
  }

  // function for view pack
  viewPack(id) {
    if (this.isSubscriber) {
      this.router.navigate(['/subscriber/viewpack/' + id]);
    } else {
      this.router.navigate(['/creator/viewpack/' + id]);
    }
  }


  // fucntion for close suggetion popup
  suggetionClose() {
    this.SuggestionPopup = false;
  }

  // function for view profile of creator
  viewProfile(key) {
    // if (this.isCreator) {
    this.router.navigate(['/mi.show/' + key]);
    // } else {

    //   this.router.navigate(['/subscriber/mi.show/' + key]);
    // }
  }

  // Function for open modal
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  // change event of contribution drop-down
  OnContributionChange(e) {
    console.log('e.value=>', e.value);

    this.payAmount = e.value;
    this.commonServcie.addTaxes(this.userID, this.state, this.payType, this.payAmount, { 'revenue_sharing': [] }).subscribe((taxes: any) => {
      this.taxes = taxes;
      this.isTaxShow = true;
      this.basicTotal = taxes.item_subtotal;
      this.finalTotal = taxes.total_payment;
      this.taxesAmount = taxes.card_transaction_fee + taxes.state_taxes + taxes.platform_fee_subscriber;
    })
    if (this.payAmount === undefined) {
      this.isValue = true;
    } else {
      this.isValue = false;
    }

  }


}
