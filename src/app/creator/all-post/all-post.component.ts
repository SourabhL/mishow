import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import * as moment from 'moment';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import * as JSZip from 'jszip';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { NgxSummernoteDirective } from 'ngx-summernote';
import * as _ from 'lodash';
import { ConfirmationService } from 'primeng/api';
@Component({
  selector: 'app-all-post',
  templateUrl: './all-post.component.html',
  styleUrls: ['./all-post.component.css']
})
export class AllPostComponent implements OnInit {
  @ViewChild('editor', { static: true }) summernote: ElementRef;
  @ViewChild('editor', { static: true }) editorDir: NgxSummernoteDirective;
  @ViewChild('timepickerWithButtons', { static: true }) timer: ElementRef;
  postForm: FormGroup;
  config: any;
  files: File[] = [];
  minDate = new Date();
  modalRef: BsModalRef;
  isDownloadable = false;
  isPost = false;
  isPack = false;
  isExclusive = false;
  isContent = false;
  isProduct = false;
  bucketName: any;
  tierDetail: any = [];
  previewImages: any = [];
  inPreview = false;
  inContent = false;
  morePreviewImage = false;
  month = moment(new Date()).format('MMM');
  day = moment(new Date()).format('DD');
  year = moment(new Date()).format('YYYY');
  dayName = moment(new Date()).format('dddd');
  cronTime: any;
  isSchedule = false;
  scheduleDate: any;
  scheduleTime: any;
  tierValues: any = [];
  submitted = false;
  var1 = 0;
  maxPostCount = 0;
  postCount = 0;
  isMaxPost = false;
  SFWvalue = false;
  isExpireFalse = false;
  expireMessage = '';
  showSpinner = false;
  allImages: any = [];
  packMedia: any = [];
  mediaURL: any;
  exclusivePreview: any = [];
  postRequired = false;
  tierRequires = false;
  isScheduleFalse = false;
  commentMessage = '';
  categoryMessage = '';
  tierMessage = '';
  hotlinkMessage = '';
  scheduleMessage = '';
  SFWMessage = '';
  isSFWFalse = false;
  isCommentsFalse = false;
  isHotLinksFalse = false;
  userDetails: any = [];
  isLive = false;
  zipData: any = [];
  hashtagerror = false;
  hashArray: any = [];
  hashtagCount = 0;
  isMaxCharacter = false;
  remainingCharacter = 0;
  commentValue = false;
  hotlinkValue = false;
  categoryRequired = false;
  expirationRequired = false;
  isEdit = false;
  isAdd = false;
  postID: any;
  isDisabled = false;
  schedule_time: any;
  schedule_date: any;
  isDateDisable = false;
  media: any;
  test: any;
  message = '';
  isLengthMax = false;
  hotlinks: any;
  comments: any;
  NSFW: any;
  title: any;
  description: any;
  category: any;
  cost: any;
  totalPost = 0;
  submitMedia = false;
  editDetails: any = [];
  freeTier = 0;
  showDropzone = false;
  delivery: any
  information: any
  qty: any;
  isProgressbar = false;
  isHotlink = false;
  isComment = false;
  isTier = false;
  isTierFalse = false;
  isNSFW = false;
  isDescription = false;
  isCategory = false;
  isCategoryFalse = false;
  isTitle = false;
  isContentChange = false;
  isCost = false;
  isQty = false;
  isDelivery = false;
  isInformation = false;
  isPostImage = false;
  informationRequire = false;
  deliveryRequire = false;
  infoRequired: any = [];
  isGoal = false;
  isExpire = false;
  isContribution = false
  minimumContribution: any
  goal: any;
  expireDate: any;
  isAvail = false;
  isExclusivemessage = false;
  isPackmessage = false;
  isProductMessage = false;
  key: any = [];
  signature: any = [];
  date: any = [];
  token: any = [];
  credential: any = [];
  algorithm: any = [];
  policy: any = [];
  i = 0;
  deliveryMethods_List: any = [
    { label: 'Select delivery option', value: '' },
    { label: 'Message Notification', value: 'Message Notification' },
    { label: 'Mail Delivery (USPS)', value: 'USPS' },
    { label: 'Mail Delivery (UPS)', value: 'UPS' },
    { label: 'Mail Delivery (FedEx)', value: 'Fedex' }
  ];
  InformationList: any = [
    { label: 'Select any option', value: '' },
    { label: 'Username for Social Media', value: 'Username for Social Media' },
    { label: 'Mailing Address', value: 'Mailing Address' },
    { label: 'None', value: 'none' },
  ];
  categoryList = [
    { label: 'Please select category', value: '' },
  ];
  min: any = []
  max: any = [];
  expireDays = 0;
  selected: {};
  expDate: any;
  profileID: any;
  username: any;
  displayName: any;
  profileImage: any;
  val2 = 0;
  userId: any;
  isApproved = false;
  time: any;
  startAt: any;
  closeResult: string;
  bucketList: any = [];
  getPresignURLResponse: any;
  confirmClick = false;

  element: HTMLFormElement;
  selectedFile: File;
  constructor(
    private commonservice: CommonService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private confirmationService: ConfirmationService,
  ) {

    this.config = this.commonservice.CONFIG;
    this.userDetails = this.commonservice.getLoggedUserDetail();

    this.commonservice.get_all_category().subscribe((res: any) => {
      res.forEach(e => {
        this.categoryList.push({ label: e.category_name, value: e.category_name });
      });
    });

    this.commonservice.get_agreement().subscribe((res: any) => {
      if (res.admin.decision === 'APPROVED') {
        this.isApproved = true;
      }
    }, err => {
      this.isApproved = false;
    })



    if (this.route.snapshot.data.title === 'add') {
      this.isAdd = true;
      // this.tierValues = 0;
      this.commonservice.get_profile().subscribe((res: any) => {
        this.category = res.category;
        this.profileID = res.profile_id;
        this.username = res.profile_url;
        this.profileImage = res.profile_picture;
        this.displayName = res.display_name;
        this.userId = res.user_id;
      }, err => {

      });
      this.postFormInit();
      this.isPost = true;
    } else {
      this.isEdit = true;
      this.postFormInit();
    }

    this.commonservice.get_subscription().subscribe((res: any) => {

      if (res.tiers) {
        this.tierValues = res.default_tier;
        this.tierDetail = res.tiers;
      }
    });



    if (this.route.snapshot.params.type === 'post') {
      this.spinner.show();
      this.isPost = true;
      this.postID = this.route.snapshot.params.id;
      this.commonservice.get_post_id(this.postID).subscribe((res: any) => {


        let dt1 = this.commonservice.scheduleDate(res.publish_date);
        let time = this.commonservice.scheduleTime(res.publish_date);

        if ((moment(dt1)).isBefore(moment(new Date()))) {
          this.isDateDisable = true;
        } else {
          this.isDateDisable = false;
          if (res.publish_date !== null) {
            this.schedule_date = moment(dt1).format('MM/DD/YYYY hh:mm');
            this.schedule_time = moment(time, 'hh:mm:ss').format('hh:mm A');
          }
        }

        this.tierValues = [res.tier_id];

        this.editDetails = res;
        this.category = res.post_category;
        this.description = res.description;
        this.NSFW = res.nsfw;
        this.comments = res.comments;
        this.hotlinks = res.hotlink;

        if (res.media.length === 10) {
          this.isLengthMax = true;
        } else {
          this.isLengthMax = false
        }

        this.media = {
          image: [],
          video: []
        };
        const isImages = ['jpg', 'jpeg', 'png', 'webp'];
        const isVideo = ['mp4'];
        res.media.forEach(element => {
          const imgStr = isImages.join(',');
          const videoStr = isVideo.join(',');
          if (imgStr.includes(element.split('.').pop()) === true) {
            this.onDownloadMedia(element).then(res => {
              this.media.image.push({ image: res, isShow: true, value: element });
            })
          } else {
            this.onDownloadMedia(element).then(res => {
              this.media.video.push({ image: res, isShow: true, value: element });
            })
          }
        });
        this.totalPost = this.media.image.length + this.media.video.length;

      });
      this.spinner.hide();
    } else if (this.route.snapshot.params.type === 'pack') {
      this.spinner.show();
      this.isPack = true;
      this.isPackmessage = true;
      this.isProductMessage = false;
      this.isExclusivemessage = false;
      this.postID = this.route.snapshot.params.id;
      //remove other controls
      this.postForm.removeControl('minimumContribution');
      this.postForm.removeControl('goal');
      this.postForm.removeControl('contentAvailable');
      this.postForm.removeControl('cost');
      this.postForm.removeControl('title');
      this.postForm.removeControl('quantity');
      this.postForm.removeControl('deliveryMethod');
      this.postForm.removeControl('requiredInformation');
      this.postForm.removeControl('hotlinks');
      this.postForm.removeControl('comments');
      // add pack controls
      this.postForm.addControl('packPrice', this.fb.control('', [Validators.required]));
      this.postForm.addControl('title', this.fb.control('', [Validators.required]));
      this.commonservice.get_pack_id(this.postID).subscribe((res: any) => {
        let dt1 = this.commonservice.scheduleDate(res.publish_date);
        let time = this.commonservice.scheduleTime(res.publish_date);

        if (moment(dt1).isBefore(moment(new Date()))) {
          this.isDateDisable = true;
        } else {
          this.isDateDisable = false;
          if (res.publish_date !== null) {
            this.schedule_date = moment(dt1).format('MM/DD/YYYY hh:mm');
            this.schedule_time = moment(time, 'hh:mm:ss').format('hh:mm A');
          }
        }
        this.title = res.title;
        this.description = res.description;
        this.cost = res.price;
        this.category = res.pack_category;
        this.NSFW = res.nsfw;
        if (res.preview_media.length === 10) {
          this.isLengthMax = true;
        } else {
          this.isLengthMax = false;
        }
        this.media = {
          image: [],
          video: []
        };
        res.preview_media.forEach(element => {
          const isImages = ['jpg', 'jpeg', 'png', 'webp'];
          const isVideo = ['mp4'];
          const imgStr = isImages.join(',');
          const videoStr = isVideo.join(',');
          if (imgStr.includes(element.split('.').pop()) === true) {
            // this.media.image.push({ image: element, isShow: true });
            this.onDownloadMedia(element).then(res => {
              this.media.image.push({ image: res, isShow: true, value: element });
            })
          } else {
            // this.media.video.push({ image: element, isShow: true });
            this.onDownloadMedia(element).then(res => {
              this.media.video.push({ image: res, isShow: true, value: element });
            })
          }
        });
      });
      this.spinner.hide();

    } else if (this.route.snapshot.params.type === 'product') {
      this.spinner.show();
      this.isProduct = true;
      this.postID = this.route.snapshot.params.id;
      this.isPackmessage = false;
      this.isProductMessage = true;
      this.isExclusivemessage = false;
      //remove other control
      this.postForm.removeControl('packPrice');
      this.postForm.removeControl('title');
      this.postForm.removeControl('minimumContribution');
      this.postForm.removeControl('exclusiveTitle');
      this.postForm.removeControl('goal');
      this.postForm.removeControl('contentAvailable');
      this.postForm.removeControl('hotlinks');
      this.postForm.removeControl('comments');

      // product control
      this.postForm.addControl('cost', this.fb.control('', [Validators.required]));
      this.postForm.addControl('title', this.fb.control('', [Validators.required]));
      this.postForm.addControl('quantity', this.fb.control('', [Validators.required]));
      this.postForm.addControl('deliveryMethod', this.fb.control('', [Validators.required]));
      this.postForm.addControl('requiredInformation', this.fb.control('', [Validators.required]));

      this.commonservice.get_product_id(this.postID).subscribe((res: any) => {

        const dt1 = this.commonservice.dateFilter(res.expiration);
        this.expDate = moment(dt1, 'MM/DD/YYYY').format(' MMM Do YYYY');
        const exDays = this.commonservice.dateFilter(res.created_at);
        const d1 = moment(exDays, 'MM/DD/YYYY').format('DD');
        const d2 = moment(dt1, 'MM/DD/YYYY').format('DD');
        this.expireDays = parseInt(d2) - parseInt(d1);

        this.description = res.product_description;
        this.cost = res.price;
        this.qty = res.quantity_available;
        this.title = res.product_name;
        this.information = res.info_needed_for_delivery;
        this.category = res.product_category;
        this.delivery = res.delivery_method;
        if (res.product_image.length === 10) {
          this.isLengthMax = true;
        } else {
          this.isLengthMax = false;
        }
        this.media = {
          image: [],
          video: []
        };
        res.product_image.forEach(element => {
          const isImages = ['jpg', 'jpeg', 'png', 'webp'];
          const isVideo = ['mp4'];
          const imgStr = isImages.join(',');
          const videoStr = isVideo.join(',');
          if (imgStr.includes(element.split('.').pop()) === true) {
            // this.media.image.push({ image: element, isShow: true });
            this.onDownloadMedia(element).then(res => {
              this.media.image.push({ image: res, isShow: true, value: element });
            })
          } else {
            // this.media.video.push({ image: element, isShow: true });
            this.onDownloadMedia(element).then(res => {
              this.media.video.push({ image: res, isShow: true, value: element });
            })
          }
        });
      });
      this.spinner.hide();
    } else if (this.route.snapshot.params.type === 'exclusive') {
      this.spinner.show();
      this.isExclusive = true;
      this.postID = this.route.snapshot.params.id;
      this.isPackmessage = false;
      this.isProductMessage = false;
      this.isExclusivemessage = true;
      // remove other controls
      this.postForm.removeControl('packPrice');
      this.postForm.removeControl('title');
      this.postForm.removeControl('cost');
      this.postForm.removeControl('quantity');
      this.postForm.removeControl('deliveryMethod');
      this.postForm.removeControl('requiredInformation');
      this.postForm.removeControl('hotlinks');
      this.postForm.removeControl('comments');

      // add exclusive controls
      this.postForm.addControl('minimumContribution', this.fb.control('', [Validators.required]));
      this.postForm.addControl('goal', this.fb.control('', [Validators.required]));
      this.postForm.addControl('contentAvailable', this.fb.control(''));
      this.postForm.addControl('title', this.fb.control('', [Validators.required]));
      this.commonservice.get_exclusive_id(this.route.snapshot.params.id).subscribe((res: any) => {

        this.title = res.title;
        this.description = res.description;
        this.goal = res.goal;
        this.category = res.exclusive_category;
        this.minimumContribution = res.min_contribution;
        this.isAvail = res.available_now;
        // this.term = true;
        if (res.media.length === 10) {
          this.isLengthMax = true;
        } else {
          this.isLengthMax = false;
        }

        this.media = {
          image: [],
          video: []
        };
        this.test = {
          image: [],
          video: []
        };
        const isImages = ['jpg', 'jpeg', 'png', 'webp'];
        const isVideo = ['mp4'];

        res.media.forEach(e => {
          const imgStr = isImages.join(',');
          const videoStr = isVideo.join(',');
          if (imgStr.includes(e.split('.').pop()) === true) {
            this.onDownloadMedia(e).then(res => {
              this.test.image.push({ image: res, isShow: true, value: e });
            })
          } else {
            this.onDownloadMedia(e).then(res => {
              this.test.video.push({ image: res, isShow: true, value: e });
            })
          }
        });


        res.exclusive_content.forEach(element => {
          const imgStr = isImages.join(',');
          const videoStr = isVideo.join(',');
          if (imgStr.includes(element.split('.').pop()) === true) {
            this.onDownloadMedia(element).then(res => {
              this.media.image.push({ image: res, isShow: true, value: element });
            })

          } else {
            this.onDownloadMedia(element).then(res => {
              this.media.video.push({ image: res, isShow: true, value: element });
            })
          }
        });


        this.totalPost = this.media.image.length + this.media.video.length;
        document.getElementById('goal').setAttribute('disabled', 'true');
        document.getElementById('minimumContribution').setAttribute('disabled', 'true');
      });
      this.spinner.hide();
    } else if (this.route.snapshot.params.type === 'content') {
      this.spinner.show();
      this.isExclusive = true;
      this.isContent = true;
      this.postID = this.route.snapshot.params.id;
      this.isPackmessage = false;
      this.isProductMessage = false;
      this.isExclusivemessage = true;
      // remove other controls
      this.postForm.removeControl('packPrice');
      this.postForm.removeControl('title');
      this.postForm.removeControl('cost');
      this.postForm.removeControl('quantity');
      this.postForm.removeControl('deliveryMethod');
      this.postForm.removeControl('requiredInformation');
      this.postForm.removeControl('hotlinks');
      this.postForm.removeControl('comments');

      // add exclusive controls
      this.postForm.addControl('minimumContribution', this.fb.control('', [Validators.required]));
      this.postForm.addControl('goal', this.fb.control('', [Validators.required]));
      this.postForm.addControl('contentAvailable', this.fb.control(''));
      this.postForm.addControl('title', this.fb.control('', [Validators.required]));
      this.commonservice.get_exclusive_id(this.route.snapshot.params.id).subscribe((res: any) => {

        this.title = res.title;
        this.description = res.description;
        this.goal = res.goal;
        this.category = res.exclusive_category;
        this.minimumContribution = res.min_contribution;
        this.isAvail = res.available_now;
        // this.term = true;
        if (res.media.length === 10) {
          this.isLengthMax = true;
        } else {
          this.isLengthMax = false;
        }

        this.media = {
          image: [],
          video: []
        };
        this.test = {
          image: [],
          video: []
        };
        const isImages = ['jpg', 'jpeg', 'png', 'webp'];
        const isVideo = ['mp4'];

        res.media.forEach(e => {
          const imgStr = isImages.join(',');
          const videoStr = isVideo.join(',');
          if (imgStr.includes(e.split('.').pop()) === true) {
            this.onDownloadMedia(e).then(res => {
              this.media.image.push({ image: res, isShow: true, value: e });
            })
            // this.test.image.push({ image: e, isShow: true });
          } else {
            this.onDownloadMedia(e).then(res => {
              this.media.video.push({ image: res, isShow: true, value: e });
            })
            // this.test.video.push({ image: e, isShow: true });
          }
        });


        res.exclusive_content.forEach(element => {
          const imgStr = isImages.join(',');
          const videoStr = isVideo.join(',');
          if (imgStr.includes(element.split('.').pop()) === true) {
            this.onDownloadMedia(element).then(res => {
              this.test.image.push({ image: res, isShow: true, value: element });
            })

          } else {
            this.onDownloadMedia(element).then(res => {
              this.test.video.push({ image: res, isShow: true, value: element });
            })
          }
        });



        this.totalPost = this.media.image.length + this.media.video.length;
        document.getElementById('goal').setAttribute('disabled', 'true');
        document.getElementById('minimumContribution').setAttribute('disabled', 'true');
        document.getElementById('title').setAttribute('disabled', 'true');

      });
      this.spinner.hide();
    }

  }


  // function for exclusive information
  open(key, temp) {
    if (key === 'contribution') {
      this.message = "This is the smallest increment you can make.";
    }

    if (key === 'goal') {
      this.message = "Goal must be met before content can be produced and released.";
    } if (key === 'content') {
      this.message = "By selecting available now , the files you upload here will be automatically released to the users who contributed to your goal.Ensure your content will high quality.";
    }



    this.modalRef = this.modalService.show(temp);
  }


  onImageClick(img, type) {

    this.confirmationService.confirm({
      message: 'Are you sure  you want to delete this item?',
      accept: () => {

        this.isLengthMax = false;

        this.commonservice.getDeletePresignURL(img.value).subscribe(res => {
          if (res) {
            if (this.isPost) {
              this.commonservice.remove_media(this.route.snapshot.params.id, img.value).subscribe(res => {
                this.media.video.splice(this.media.video.indexOf(img.image), 1);
                this.toastr.success('Image deleted successfully', "Success!", {
                  timeOut: 1000
                });
                this.postCount--;
                img.isShow = false;
                // this.router.navigate(['/creator/profile']);
              }, err => {
                this.toastr.error(err.error.message, "Error!", {
                  timeOut: 1000
                });
              });
            }

            if (this.isPack) {
              this.commonservice.remove_media_pack(this.route.snapshot.params.id, img.value).subscribe(res => {
                this.media.video.splice(this.media.video.indexOf(img), 1);
                this.toastr.success('Image deleted successfully', "Success!", {
                  timeOut: 1000
                });
                img.isShow = false;
                this.postCount--;
                // this.router.navigate(['/creator/profile']);
              }, err => {
                this.toastr.error(err.error.message, "Error!", {
                  timeOut: 1000
                });
              });
            }

            if (this.isProduct) {
              this.commonservice.remove_media_product(this.route.snapshot.params.id, img.value).subscribe(res => {
                this.media.video.splice(this.media.video.indexOf(img), 1);
                this.toastr.success('Image deleted successfully');
                img.isShow = false;
                this.postCount--;
                // this.router.navigate(['/creator/profile']);
              }, err => {
                this.toastr.error(err.error.message);
              });
            }

            if (this.isExclusive) {
              if (type === 'content') {
                this.commonservice.update_content('remove', this.route.snapshot.params.id, img.value).subscribe(res => {
                  this.media.video.splice(this.media.video.indexOf(img), 1);
                  this.toastr.success('Image deleted successfully');
                  img.isShow = false;
                  this.postCount--;
                  // this.router.navigate(['/creator/profile']);
                }, err => {
                  this.toastr.error(err.error.message, "Error!", {
                    timeOut: 1000
                  });
                });
              } else {
                this.commonservice.remove_media_exclusive(this.route.snapshot.params.id, img.value).subscribe(res => {
                  this.media.video.splice(this.media.video.indexOf(img), 1);
                  this.toastr.success('Image deleted successfully');
                  img.isShow = false;
                  this.postCount--;
                  // this.router.navigate(['/creator/profile']);
                }, err => {
                  this.toastr.error(err.error.message, "Error!", {
                    timeOut: 1000
                  });
                });
              }

            }
          }
        },
          err => {
            this.toastr.error(err.error.message, "Error!", {
              timeOut: 1000
            });
          });
      }
    });
  }

  onVideoClick(img) {
    this.confirmationService.confirm({
      message: 'Are you sure  you want to delete this item?',
      accept: () => {

        this.isLengthMax = false;

        this.commonservice.getDeletePresignURL(img.value).subscribe(res => {
          if (res) {
            if (this.isPost) {
              this.commonservice.remove_media(this.route.snapshot.params.id, img.value).subscribe(res => {
                this.media.video.splice(this.media.video.indexOf(img), 1);
                this.toastr.success('Image deleted successfully', "Success!", {
                  timeOut: 1000
                });
                img.isShow = false;
                this.postCount--;
              }, err => {
                this.toastr.error(err.error.message, "Error!", {
                  timeOut: 1000
                });
              });
            }

            if (this.isPack) {
              this.commonservice.remove_media_pack(this.route.snapshot.params.id, img.value).subscribe(res => {
                this.media.video.splice(this.media.video.indexOf(img), 1);
                this.toastr.success('Image deleted successfully', "Success!", {
                  timeOut: 1000
                });
                img.isShow = false;
                this.postCount--;
              }, err => {
                this.toastr.error(err.error.message, "Error!", {
                  timeOut: 1000
                });
              });
            }

            if
              (this.isProduct) {
              this.commonservice.remove_media_product(this.route.snapshot.params.id, img.value).subscribe(res => {
                this.media.video.splice(this.media.video.indexOf(img), 1);
                this.toastr.success('Image deleted successfully', "Success!", {
                  timeOut: 1000
                });
                img.isShow = false;
                this.postCount--;
              }, err => {
                this.toastr.error(err.error.message, "Error!", {
                  timeOut: 1000
                });
              });
            }

            if (this.isExclusive) {
              this.commonservice.remove_media_exclusive(this.route.snapshot.params.id, img.value).subscribe(res => {
                this.media.video.splice(this.media.video.indexOf(img), 1);
                this.toastr.success('Image deleted successfully', "Success!", {
                  timeOut: 1000
                });
                img.isShow = false;
                this.postCount--;
              }, err => {
                this.toastr.error(err.error.message, "Error!", {
                  timeOut: 1000
                });
              });
            }

          }
        }, err => {
          this.toastr.error(err.error.message, "Error!", {
            timeOut: 1000
          });
        });
      }
    });
  }


  // function for display upload option while edit
  onUpload() {
    this.showDropzone = true;
  }


  // function for while click on save tier button
  tierSave() {
    if (this.tierValues.length === 0) {
      this.tierRequires = true;
    } else {
      this.tierRequires = false;
    }


    this.modalRef.hide();
    this.modalRef = null;
  }

  // function when click on PACK
  pack() {
    this.isPost = false;
    this.isPack = true;
    this.isExclusive = false;
    this.isProduct = false;
    this.isPackmessage = true;
    this.isProductMessage = false;
    this.isExclusivemessage = false;
    //remove other controls
    this.postForm.removeControl('minimumContribution');
    this.postForm.removeControl('goal');
    this.postForm.removeControl('contentAvailable');
    this.postForm.removeControl('cost');
    this.postForm.removeControl('title');
    this.postForm.removeControl('quantity');
    this.postForm.removeControl('deliveryMethod');
    this.postForm.removeControl('requiredInformation');
    this.postForm.removeControl('hotlinks');
    this.postForm.removeControl('comments');

    // add pack controls
    this.postForm.addControl('packPrice', this.fb.control('', [Validators.required]));
    this.postForm.addControl('title', this.fb.control('', [Validators.required]));



  }


  // function when click on PRODUCT
  product() {
    this.isPost = false;
    this.isPack = false;
    this.isExclusive = false;
    this.isProduct = true;
    this.isPackmessage = false;
    this.isProductMessage = true;
    this.isExclusivemessage = false;

    //remove other control
    this.postForm.removeControl('packPrice');
    this.postForm.removeControl('title');
    this.postForm.removeControl('minimumContribution');
    this.postForm.removeControl('exclusiveTitle');
    this.postForm.removeControl('goal');
    this.postForm.removeControl('contentAvailable');
    this.postForm.removeControl('hotlinks');
    this.postForm.removeControl('comments');

    // product control
    this.postForm.addControl('cost', this.fb.control('', [Validators.required]));
    this.postForm.addControl('title', this.fb.control('', [Validators.required]));
    this.postForm.addControl('quantity', this.fb.control('', [Validators.required]));
    this.postForm.addControl('deliveryMethod', this.fb.control('', [Validators.required]));
    this.postForm.addControl('requiredInformation', this.fb.control('', [Validators.required]));


  }


  // function when click on EXCLUSIVE
  exclsive() {
    this.isPost = false;
    this.isPack = false;
    this.isExclusive = true;
    this.isProduct = false;
    this.isPackmessage = false;
    this.isProductMessage = false;
    this.isExclusivemessage = true;
    // remove other controls
    this.postForm.removeControl('packPrice');
    this.postForm.removeControl('title');
    this.postForm.removeControl('cost');
    this.postForm.removeControl('quantity');
    this.postForm.removeControl('deliveryMethod');
    this.postForm.removeControl('requiredInformation');
    this.postForm.removeControl('hotlinks');
    this.postForm.removeControl('comments');

    // add exclusive controls
    this.postForm.addControl('minimumContribution', this.fb.control('', [Validators.required]));
    this.postForm.addControl('goal', this.fb.control('', [Validators.required]));
    this.postForm.addControl('contentAvailable', this.fb.control(''));
    this.postForm.addControl('title', this.fb.control('', [Validators.required]));
  }


  // onChange Event for changing Delivery method details
  onDelivery(e) {
    if (this.postForm.value.deliveryMethod == '') {
      this.deliveryRequire = true;
    } else {
      this.isDelivery = true;
      this.deliveryRequire = false;
    }
  }

  // onChange Event for changing category details
  onCategory(e) {
    if (this.category === '') {
      this.categoryRequired = true;
    } else {
      this.categoryRequired = false;
    }
  }

  makeDefault(e) {
    if (e === true) {
      this.isDisabled = true;
      let obj = {
        opt: 'update',
        default_tier: this.tierValues,
      }
      this.commonservice.update_subscription(obj).subscribe(res => {
        this.toastr.success('save Tier :' + this.tierValues + 'as Default tier for all post.');
      })
    } else {

    }

  }


  // function for when click on save button on setting popup
  settingSave() {
    if (this.category !== '') {
      this.isCategory = true;
      this.isCategoryFalse = true;
      this.categoryMessage = "Post has " + this.postForm.value.category + ' category.';
    } else {
      this.categoryRequired = true;
    }

    this.modalRef.hide();
    this.modalRef = null;
  }

  // onChange Event for changing information details
  onInformation(e) {
    this.infoRequired = e.value;
    if (this.infoRequired.length == 0) {
      this.informationRequire = true;
    } else {
      this.isInformation = true;
      this.informationRequire = false;
    }
  }

  //function for when user select preview images from all images
  onPreviewImage(e, filename) {
    this.inPreview = true;
    let l1 = 0;
    if (e === true) {
      l1++;
      this.val2 = l1;
      this.previewImages.push(filename);
    } else {
      this.previewImages.splice(this.previewImages.indexOf(event), 1);
    }
    if (this.previewImages.length <= 10) {
      this.morePreviewImage = false;
    } else {
      this.morePreviewImage = true;
    }

  }

  ngOnInit() {
  }

  // function for changing settings
  onSettingChange(key, e) {
    if (key === 'comments') {
      this.commentValue = e.checked;
      this.isComment = true;
      if (this.commentValue === false) {
        this.isCommentsFalse = true;
        this.commentMessage = 'Comments will be disabled for this post.';
      } else {
        this.isCommentsFalse = true;
        this.commentMessage = 'Comments will be enable for this post.';
      }
    }

    if (key === 'hotlinks') {
      this.hotlinkValue = e.checked;
      this.isHotlink = true;
      if (this.hotlinkValue === false) {
        this.isHotLinksFalse = true;
        this.hotlinkMessage = 'Hotlinks will be disabled for this post.';
      } else {
        this.isHotLinksFalse = true;
        this.hotlinkMessage = 'Hotlinks will be enable for this post.';
      }
    }
  }

  // function for when click on calendar icon
  onCanlendar(temp) {
    this.modalRef = this.modalService.show(temp);
  }
  // function for closing popup
  close(temp) {
    this.schedule_time = [];
    this.modalRef.hide();
    this.modalRef = null;
    temp = [];
  }


  // function for creating controls for post form
  postFormInit = () => {
    this.postForm = new FormGroup({
      description: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      SFW: new FormControl(''),
      comments: new FormControl(''),
      hotlinks: new FormControl(''),

    });
  }

  // function for when click on expiry date
  onExpire(e) {
    if (e == 0) {
      this.expireDays = 1;
    }
    if (e == 1) {
      this.expireDays = 3;
    }
    if (e == 3) {
      this.expireDays = 5;
    }
    if (e == 5) {
      this.expireDays = 7;
    }

    if (e == 7) {
      this.expireDays = 0;
    }
    this.isExpire = true;

    let dt = moment().add(this.expireDays, 'days').calendar('MM/DD/YYYY');
    let time = moment(new Date()).format('kk:mm:ss');
    let expiration = dt + ' ' + time;
    this.expireDate = moment(expiration, 'MM/DD/YYYY kk:mm:ss').format('YYYY-MM-DD-kk:mm:ss');
    this.expDate = moment(expiration, 'MM/DD/YYYY kk:mm:ss').format('MMM Do YYYY');


    // this.isExpireFalse = true
    // this.expireMessage = "This product  is expire on " + this.expDate + ' at ' + time;

    // if (this.expireDate === undefined) {
    //   this.expirationRequired = true;
    // } else {
    //   this.expirationRequired = false;
    // }


  }


  // function for click on tiers
  onTierChange(tierid) {
    this.isTier = true;
    this.isTierFalse = true;
    this.tierMessage = 'Post is enable for ' + this.tierValues + ' tiers.';

    if (tierid == 0) {
      this.toastr.info('All user can see you post');
    } else {
      this.toastr.info('All the above tier user can see the post.');
    }
  }


  // function for selecting any date from calendar
  onCalendarSelect(e) {
    this.dayName = moment(e).format('dddd');
    this.month = moment(e).format('MMM');
    this.day = moment(e).format('DD');
    this.year = moment(e).format('YYYY');
    this.scheduleDate = moment(e).format('YYYY-MM-DD');
    this.isSchedule = true;
  }

  // function for changing SFW
  onCheck(key, e) {
    if (key === 'SFW') {
      this.SFWvalue = e;
      this.isNSFW = true;
      if (this.SFWvalue === true) {
        this.isSFWFalse = true;
        this.SFWMessage = 'This post marked NSFW for nudity or sexually explicit content';
      } else {
        this.isSFWFalse = false;
      }
    }
  }

  // function for selecting time
  timeChanged(e: any) {
    this.i = this.i + 1;
    this.isSchedule = true;
    const time = e.selectedHour.time + ':' + e.selectedMinute.time + ' ' + e.selectedPeriod;
    this.scheduleTime = moment(time, 'hh:mm A').format('kk:mm:ss');
    e = [];
    if (this.scheduleDate == undefined) {
      let d = moment(this.schedule_date, 'MM/DD/YYYY hh:mm').format('YYYY-MM-DD');
      this.cronTime = d + ' ' + this.scheduleTime;
    } else {
      this.cronTime = this.scheduleDate + ' ' + this.scheduleTime;
    }


    if ((moment(this.scheduleDate).format('MM/DD/YYYY')) > (moment(new Date()).format('MM/DD/YYYY'))) {
      this.isScheduleFalse = true;
      this.scheduleMessage = "This post is scheduled for " + moment(this.scheduleDate).format('MMMM DD ,YYYY') + ' at ' + moment(this.scheduleTime, 'kk:mm;ss').format('hh:mm A');
    }
    this.modalRef.hide();
  }


  // Function for Add new Images or video
  onSelect(event) {

    const isImages = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];
    const isVideo = ['video/mp4'];

    this.var1 = event.addedFiles.length;

    if (this.isPack) {

      if (this.isAdd) {
        if (this.postCount > 0) {
          if ((this.postCount + event.addedFiles.length) <= 70) {
            this.postCount = this.postCount + this.var1;
            const imgStr = isImages.join(',');
            const videoStr = isVideo.join(',');
            let i = 0;
            for (let file of event.addedFiles) {
              if (imgStr.includes(file.type) === false) {
                if (videoStr.includes(file.type) === false) {
                  event.addedFiles[i].is_image = false;
                  event.addedFiles[i].is_video = false;
                } else {
                  event.addedFiles[i].is_video = true;
                }
              } else {
                event.addedFiles[i].is_image = true;
              }
              i++;
            }

            this.files.push(...event.addedFiles);

            this.isMaxPost = false;
          } else {
            this.isMaxPost = true;

          }
        }
        else {
          if (this.maxPostCount <= 70 && this.postCount <= 70) {
            this.postCount = this.postCount + this.var1;
            const imgStr = isImages.join(',');
            const videoStr = isVideo.join(',');
            let i = 0;
            for (let file of event.addedFiles) {
              if (imgStr.includes(file.type) === false) {
                if (videoStr.includes(file.type) === false) {
                  event.addedFiles[i].is_image = false;
                  event.addedFiles[i].is_video = false;
                } else {
                  event.addedFiles[i].is_video = true;
                }
              } else {
                event.addedFiles[i].is_image = true;
              }
              i++;
            }

            this.files.push(...event.addedFiles);

            this.isMaxPost = false;
          } else {
            this.isMaxPost = true;
            this.maxPostCount = 0;
          }
        }


        if (this.files.length === 0) {
          this.postRequired = true;
        } else {
          this.postRequired = false;
        }
      }

      if (this.isEdit) {
        let totalPost = this.media.image.length + this.media.video.length;
        this.maxPostCount = this.maxPostCount + totalPost + this.var1;
        if (this.maxPostCount <= 10) {
          this.isPostImage = true;
          const imgStr = isImages.join(',');
          const videoStr = isVideo.join(',');
          let i = 0;
          for (let file of event.addedFiles) {
            if (imgStr.includes(file.type) === false) {
              if (videoStr.includes(file.type) === false) {
                event.addedFiles[i].is_image = false;
                event.addedFiles[i].is_video = false;
              } else {
                event.addedFiles[i].is_video = true;
              }
            } else {
              event.addedFiles[i].is_image = true;
            }
            i++;
          }

          this.files.push(...event.addedFiles);

          this.isMaxPost = false;
        } else {
          this.isMaxPost = true;
          this.maxPostCount = 0;
        }
        if ((this.files.length + this.media.image.length + this.media.video.length) === 0) {
          this.postRequired = true;
        } else {
          this.postRequired = false;
        }
      }

    } else {
      if (this.isAdd) {
        this.maxPostCount = this.maxPostCount + this.var1;
        if (this.postCount > 0) {
          if ((this.postCount + event.addedFiles.length <= 10)) {
            // if (this.maxPostCount <= 10 && this.postCount <= 10) {
            this.postCount = this.postCount + this.var1;
            const imgStr = isImages.join(',');
            const videoStr = isVideo.join(',');
            let i = 0;
            for (let file of event.addedFiles) {
              if (imgStr.includes(file.type) === false) {
                if (videoStr.includes(file.type) === false) {
                  event.addedFiles[i].is_image = false;
                  event.addedFiles[i].is_video = false;
                } else {
                  event.addedFiles[i].is_video = true;
                }
              } else {
                event.addedFiles[i].is_image = true;
              }
              i++;
            }

            this.files.push(...event.addedFiles);

            this.isMaxPost = false;
            // }
          }
          else {
            this.isMaxPost = true;
            this.maxPostCount = 0;
          }
        } else {
          if (this.maxPostCount <= 10 && this.postCount <= 10) {
            this.postCount = this.postCount + this.var1;
            const imgStr = isImages.join(',');
            const videoStr = isVideo.join(',');
            let i = 0;
            for (let file of event.addedFiles) {
              if (imgStr.includes(file.type) === false) {
                if (videoStr.includes(file.type) === false) {
                  event.addedFiles[i].is_image = false;
                  event.addedFiles[i].is_video = false;
                } else {
                  event.addedFiles[i].is_video = true;
                }
              } else {
                event.addedFiles[i].is_image = true;
              }
              i++;
            }

            this.files.push(...event.addedFiles);

            this.isMaxPost = false;
          } else {
            this.isMaxPost = true;
            this.maxPostCount = 0;
          }
        }


        if (this.files.length === 0) {
          this.postRequired = true;
        } else {
          this.postRequired = false;
        }


      }

      if (this.isEdit) {
        this.maxPostCount = this.maxPostCount + this.totalPost + this.var1;
        console.log('this.postCount=>', this.postCount);

        if (this.postCount > 0) {
          if ((this.postCount + event.addedFiles.length <= 10)) {
            this.postCount = this.postCount + event.addedFiles.length;
            this.inContent = true;
            this.isPostImage = true;
            const imgStr = isImages.join(',');
            const videoStr = isVideo.join(',');
            let i = 0;
            for (let file of event.addedFiles) {
              if (imgStr.includes(file.type) === false) {
                if (videoStr.includes(file.type) === false) {
                  event.addedFiles[i].is_image = false;
                  event.addedFiles[i].is_video = false;
                } else {
                  event.addedFiles[i].is_video = true;
                }
              } else {
                event.addedFiles[i].is_image = true;
              }
              i++;
            }

            this.files.push(...event.addedFiles);

            this.isMaxPost = false;
          } else {
            this.isMaxPost = true;
            this.maxPostCount = 0;
            this.inContent = false;
          }

        } else {
          console.log('this.maxPostCount=>', this.maxPostCount);

          if (this.maxPostCount <= 10 && this.postCount <= 10) {
            this.postCount = this.postCount + this.totalPost + event.addedFiles.length;
            this.isPostImage = true;
            this.inContent = true;
            const imgStr = isImages.join(',');
            const videoStr = isVideo.join(',');
            let i = 0;
            for (let file of event.addedFiles) {
              if (imgStr.includes(file.type) === false) {
                if (videoStr.includes(file.type) === false) {
                  event.addedFiles[i].is_image = false;
                  event.addedFiles[i].is_video = false;
                } else {
                  event.addedFiles[i].is_video = true;
                }
              } else {
                event.addedFiles[i].is_image = true;
              }
              i++;
            }

            this.files.push(...event.addedFiles);

            this.isMaxPost = false;
          } else {
            this.isMaxPost = true;
            this.maxPostCount = 0;
            this.inContent = false;
          }
        }


        if ((this.files.length + this.media.image.length + this.media.video.length) === 0) {
          this.postRequired = true;
        } else {
          this.postRequired = false;
        }
      }

    }
    // }



  }


  // Function for removing image
  onRemove(event) {
    // this.confirmationService.confirm({
    //   message: 'Are you sure  you want to delete this item?',
    //   accept: () => {
    this.files.splice(this.files.indexOf(event), 1);
    this.postCount--;

    //     if (this.isEdit) {
    //       if ((this.totalPost + this.files.length) > 10) {
    //         this.submitMedia = true;
    //       } else {
    //         this.submitMedia = false;
    //       }
    //     } else {
    //       if (this.files.length > 10) {
    //         this.submitMedia = true;
    //       } else {
    //         this.submitMedia = false;
    //       }
    //     }
    //   }
    // });
  }

  // function for counting '#' tags
  hashtagArray(value) {

    var text = value.replace(/<\/?[^>]+>/ig, " ");
    let t1 = text.replace('&nbsp;', " ");

    this.hashArray = [];
    let maxLength = 350;
    this.hashtagCount = 0;
    this.isDescription = true;
    let tag = t1.split(' ');


    tag.forEach(element => {
      if (element.includes('#')) {
        this.hashtagCount++;


        if (element.includes('</p>')) {
          let e = element.split('</p>');

          this.hashArray.push(e[0]);
        } else {
          this.hashArray.push(element);

        }


        if (this.hashtagCount > 5) {
          this.hashtagerror = true;
        } else {
          this.hashtagerror = false;
        }
      }

    });

    if ((value.length - maxLength) > 0) {
      this.remainingCharacter = value.length;
      this.isMaxCharacter = true;
    }
    else {
      this.isMaxCharacter = false;
    }
    //

    // this.Hashtags = value.split(' ');
    // this.Hashtags.forEach(element => {
    //   if (element.includes('#')) {
    //     this.hashArray.push(element);
    // }
    // else {
    //   this.descriptionArray.push(element);
    // }
    // });


  }

  // Function for converting file in base64
  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });

  }

  // function for get file for converting into base64
  getFileDataFromFile = (file, name) => {
    return new Promise((resolve, reject) => {
      this.getBase64(file)
        .then((b64: any) => {
          resolve({ b64, name });
        })
        .catch(err => reject(err)
        );
    });
  }

  // function for compressing file
  async compressFiles() {
    return new Promise((pass, fail) => {
      const jszip = new JSZip();
      const content = jszip.folder('content');
      const IMGs = Promise.all(this.files
        .map(img => this.getFileDataFromFile(img, img.name)));

      IMGs.then((imgs: any) => {
        imgs.map((img: any) => content.file(
          img.name.split('/').pop(),
          img.b64.split('base64,').pop(),
          { base64: true }));
        jszip.generateAsync({ type: 'blob' }).then((cnt) => {
          pass(cnt);
          // see FileSaver.js
          // saveAs(cnt, 'example.zip');
        }).catch(err => {
          fail(err);
        });
      });
    });


  }

  // function for closing information tabs
  onCloseClick(key) {
    if (key === 'comment') {
      this.isCommentsFalse = false;

    }
    if (key === 'hotlink') {
      this.isHotLinksFalse = false;
    }
    if (key === 'tier') {
      this.isTierFalse = false;
    }
    if (key === 'SFW') {
      this.isSFWFalse = false;
    }
    if (key === 'category') {
      this.isCategoryFalse = false;
    }
    if (key === 'schedule') {
      this.isScheduleFalse = false;
    }

    // if (key === 'expire') {
    //   this.isExpireFalse = false;
    // }

    if (key === 'pack') {
      this.isPackmessage = false;
    }
    if (key === 'product') {
      this.isProductMessage = false;
    }

    if (key === 'exclusie') {
      this.isExclusivemessage = false;
    }

  }

  // function for Onchnage method event for all controls
  onChange(key) {
    if (key === 'description') {
      this.isDescription = true;
    }

    if (key === 'avail') {
      this.isContentChange = true;
    }

    if (key === 'title') {
      this.isTitle = true;
    }
    if (key === 'cost') {
      this.isCost = true;
    }

    if (key === 'quantity') {
      this.isQty = true;
    }

    if (key === 'minimumContribution') {
      this.isContribution = true;
    }

    if (key === 'goal') {
      this.isGoal = true;
    }
  }


  // function for uploading media on s3
  async onUploadMedia(files) {

    this.allImages = [];
    return new Promise((pass, fail) => {
      let cnt = 0;
      if (this.isPost) {
        this.bucketName = 'mishow-post-store';
      }

      if (this.isPack) {
        this.bucketName = 'mishow-pack-store';
      }
      if (this.isProduct) {
        this.bucketName = 'mishow-product-store';
      }
      if (this.isExclusive) {
        this.bucketName = 'mishow-exclusive-store';
      }
      this.commonservice.getAllBuckets().subscribe(res => { });

      if (files.type === 'application/zip') {

        this.commonservice.getPresignURL('upload', this.bucketName, this.userDetails.sub, files.name).subscribe((data: any) => {


          let formData: FormData = new FormData();
          formData.append('key', data.url.fields.key);
          formData.append('x-amz-algorithm', data.url.fields['x-amz-algorithm']);
          formData.append('x-amz-credential', data.url.fields['x-amz-credential']);
          formData.append('x-amz-date', data.url.fields['x-amz-date']);
          formData.append('x-amz-security-token', data.url.fields['x-amz-security-token']);
          formData.append('policy', data.url.fields.policy);
          formData.append('x-amz-signature', data.url.fields['x-amz-signature']);

          formData.append('x-amz-server-side-encryption', 'AES256');
          formData.append('Content-Type', files.type);

          formData.append('file', files.file, files.name);
          // this.token = localStorage.getItem('id_token')
          localStorage.setItem('token', localStorage.getItem('token'));
          localStorage.removeItem('id_token');

          let url = this.bucketName + '?file-name=' + this.userDetails.sub + '/' + files.name;
          this.http.post(data.url.url, formData).subscribe(res => {

            localStorage.setItem('id_token', localStorage.getItem('token'));
            this.allImages = url;

            pass(this.allImages);


          }, err => {
            fail(err)
            localStorage.setItem('id_token', localStorage.getItem('token'));
          });

        }, err => {
          fail(err)
        });

      } else {

        for (const e of files) {
          this.commonservice.getPresignURL('upload', this.bucketName, this.userDetails.sub, e.name).subscribe((data: any) => {


            let formData: FormData = new FormData();
            formData.append('key', data.url.fields.key);
            formData.append('x-amz-algorithm', data.url.fields['x-amz-algorithm']);
            formData.append('x-amz-credential', data.url.fields['x-amz-credential']);
            formData.append('x-amz-date', data.url.fields['x-amz-date']);
            formData.append('x-amz-security-token', data.url.fields['x-amz-security-token']);
            formData.append('policy', data.url.fields.policy);
            formData.append('x-amz-signature', data.url.fields['x-amz-signature']);

            formData.append('x-amz-server-side-encryption', 'AES256');
            formData.append('Content-Type', e.type);

            formData.append('file', e, e.name);

            if (localStorage.getItem('id_token') !== null) {
              this.token = localStorage.getItem('id_token')
              localStorage.setItem('token', this.token);
              localStorage.removeItem('id_token');
            }


            let url = this.bucketName + '?file-name=' + this.userDetails.sub + '/' + e.name;
            this.http.post(data.url.url, formData).subscribe(res => {

              localStorage.setItem('id_token', localStorage.getItem('token'));
              this.allImages.push(url);
              if (files.length === this.allImages.length) {
                pass(this.allImages);
              }


            }, err => {
              fail(err)
              localStorage.setItem('id_token', localStorage.getItem('token'));
            });

          }, err => {
            fail(err)
          });
          cnt++;
        }

      }


    })
  }

  // function for downloading media from s3
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


  // function for submitting post form
  onSubmit(valid) {
    this.submitted = true;
    let cnt = 0;
    let dt;
    this.allImages = [];
    if (this.files.length === 0) {
      this.postRequired = true;
    } else {
      this.postRequired = false;
    }

    if (this.isPost) {
      if (this.tierValues.length === 0) {
        this.tierRequires = true;
      } else {
        this.tierRequires = false;
      }

      if (this.isAdd) {
        if (this.category === '') {
          this.categoryRequired = true;
        } else {
          this.categoryRequired = false;
        }
        if (valid && !this.tierRequires && !this.postRequired && !this.categoryRequired) {



          this.showSpinner = true;
          this.isProgressbar = true;

          // for (const element of this.files) {


          this.onUploadMedia(this.files).then((res: any) => {
            if (this.var1 === res.length) {

              if ((moment(this.scheduleDate).format('MM/DD/YYYY')) === (moment(new Date()).format('MM/DD/YYYY'))) {
                this.isLive = true;
              } else {
                this.isLive = false;
              }
              if (this.isSchedule) {
                dt = moment(this.cronTime, 'YYYY-MM-DD kk:mm:ss').format('YYYY-MM-DD-kk:mm:ss');
              } else {
                dt = moment(new Date(), 'ddd MMM DD YYYY hh:mm:ss').format('YYYY-MM-DD-kk:mm:ss');
              }
              let obj = {
                description: this.postForm.value.description,
                tags: this.hashArray,
                post_category: this.category,
                publish_date: dt,
                live: this.isLive,
                nsfw: this.SFWvalue ? this.SFWvalue : false,
                tier_id: this.tierValues,
                comments: this.commentValue,
                hotlink: this.hotlinkValue,
                media: res,
                expiry_date: this.expireDate,
              };
              this.commonservice.add_post(obj).subscribe((res: any) => {
                this.showSpinner = false;
                this.isProgressbar = false;

                let obj = {
                  event_type: 'NEW_POST',
                  profile_id: this.profileID,
                  message: 'New post from ' + this.username,
                  hyperlink: this.username + "/post/" + res.post_id,
                  from_info: {
                    display_name: this.displayName,
                    profile_url: this.username,
                    user_id: this.userId
                  }
                }
                this.commonservice.Subscriber_notification(obj).subscribe((res: any) => { })
                this.toastr.success(' Post is Successfuly Uploaded');
                this.commonservice.user_log({ message: 'Post Added succesfully!' }).subscribe(res => { });
                this.router.navigate(['creator/profile']);
              }, err => {
                this.showSpinner = false;
                this.isProgressbar = false;
                this.toastr.error('Having issue while upload post');
              });
            }
          })
            .catch(err => {
              this.isProgressbar = false;
              this.toastr.error('Having issue while uploading on bucket');
            });
          cnt++;
          // }
        }
      }

      if (this.isEdit) {

        if (this.postCount > 10) {
          this.submitMedia = true;
        } else {
          this.submitMedia = false;
        }

        if ((this.files.length + this.media.image.length + this.media.video.length) === 0) {
          this.postRequired = true;
        } else {
          this.postRequired = false;
        }



        if (this.isCategory || this.isDescription || this.isNSFW || this.isTier || this.isComment || this.isHotlink || this.isSchedule) {
          this.showSpinner = true;
          this.isProgressbar = true;
          let obj = {};

          if (this.isDescription) {
            obj['description'] = this.postForm.value.description;
            if (this.hashArray.length > 0) {
              obj['tags'] = this.hashArray;
            };
            obj['post_id'] = this.postID;
          }

          // if (this.isExpire) {
          //   if (this.postForm.value.title !== '') {
          //     obj['expiration'] = this.expireDate;
          //     obj['product_id'] = this.postID;
          //   }
          // }

          if (this.isNSFW) {
            obj['nsfw'] = this.SFWvalue;
            obj['post_id'] = this.postID;
          }

          if (this.isTier) {

            obj['tier_id'] = this.tierValues;
            obj['post_id'] = this.postID;
          }

          if (this.isComment) {
            obj['comments'] = this.postForm.value.comments;
            obj['post_id'] = this.postID;
          }

          if (this.isCategory) {
            obj['post_category'] = this.category;
            obj['post_id'] = this.postID;
          }
          if (this.isHotlink) {
            obj['hotlink'] = this.postForm.value.hotlinks;
            obj['post_id'] = this.postID;
          }

          if (this.isSchedule) {
            let dt;
            if ((moment(this.scheduleDate).format('MM/DD/YYYY')) === (moment(new Date()).format('MM/DD/YYYY'))) {
              this.isLive = true;
            } else {
              this.isLive = false;
            }

            if (this.scheduleDate !== '' || this.scheduleDate !== undefined) {
              dt = moment(this.cronTime, 'YYYY-MM-DD kk:mm:ss').format('YYYY-MM-DD-kk:mm:ss');
            } else {
              dt = moment(new Date(), 'ddd MMM DD YYYY hh:mm:ss').format('YYYY-MM-DD-kk:mm:ss');
            }
            obj['publish_date'] = dt;
            obj['live'] = this.isLive;
            obj['post_id'] = this.postID;
          }

          this.commonservice.modify_post(obj).subscribe(res => {
            this.showSpinner = false;
            this.isProgressbar = false;
            this.toastr.success('Post updated successfully');
            this.commonservice.user_log({ message: 'Post Updated succesfully!' }).subscribe(res => { });
            this.router.navigate(['creator/profile']);
          }, err => {
            this.showSpinner = false;
            this.isProgressbar = false;
            this.toastr.error(err.error.message);
          });
        }

        if (this.isPostImage && !this.submitMedia && !this.postRequired) {
          this.showSpinner = true;
          this.isProgressbar = true;

          this.onUploadMedia(this.files).then((image: any) => {
            console.log('image edit=>', image);
            image.forEach(element => {
              this.commonservice.update_media(this.postID, element).subscribe(res => {
                this.toastr.success('Media uploaded succesfully');
                this.commonservice.user_log({ message: 'Post Updated succesfully!' }).subscribe(res => { });
                this.isProgressbar = false;
                this.showSpinner = false;
                this.router.navigate(['creator/profile']);
              }, err => {
                this.toastr.error(err.error.message);
                this.showSpinner = false;
                this.isProgressbar = false;
              });
            });

          }).then(res => {
            this.showSpinner = false;
            this.isProgressbar = false;
          }).catch(err => {
            this.showSpinner = false;
            this.isProgressbar = false;
          });
          cnt++;


        }
      }

    }

    if (this.isPack) {

      if (this.isAdd) {
        if (this.category === '') {
          this.categoryRequired = true;
        } else {
          this.categoryRequired = false;
        }

        if (this.previewImages.length <= 10) {
          this.morePreviewImage = false;
        } else {
          this.morePreviewImage = true;
        }

        if (valid && !this.morePreviewImage && !this.postRequired && !this.categoryRequired && !this.categoryRequired) {


          this.showSpinner = true;
          this.isProgressbar = true;
          // for (let img of this.previewImages) {
          this.onUploadMedia(this.previewImages).then((res: any) => {
            this.packMedia = res;
            if (this.allImages.length === this.previewImages.length) {
              this.compressFiles().then((file: any) => {

                this.zipData = file;
                let obj = {
                  name: this.postForm.value.title + '.zip',
                  file: file,
                  type: file.type
                }

                this.zipData = obj;
                this.onUploadMedia(this.zipData).then((zip: any) => {
                  console.log('zip=>', zip);

                  this.mediaURL = zip;

                }).catch(err => {

                }).then(bb => {
                  if (this.mediaURL !== '') {


                    if ((moment(this.scheduleDate).format('MM/DD/YYYY')) === (moment(new Date()).format('MM/DD/YYYY'))) {
                      this.isLive = true;
                    } else {
                      this.isLive = false;
                    }

                    if (this.isSchedule) {
                      dt = moment(this.cronTime, 'YYYY-MM-DD kk:mm:ss').format('YYYY-MM-DD-kk:mm:ss');
                    } else {
                      dt = moment(new Date(), 'ddd MMM DD YYYY hh:mm:ss').format('YYYY-MM-DD-kk:mm:ss');
                    }
                    let obj = {
                      title: this.postForm.value.title,
                      description: this.postForm.value.description,
                      pack_category: this.category,
                      preview_media: this.packMedia,
                      pack_media: this.mediaURL,
                      price: this.postForm.value.packPrice,
                      nsfw: this.SFWvalue ? this.SFWvalue : false,
                      publish_date: dt,
                      live: this.isLive,
                      //  expiration: this.expireDate,
                    };

                    this.commonservice.add_pack(obj).subscribe((res: any) => {
                      this.showSpinner = false;
                      this.isProgressbar = false;
                      let obj = {
                        event_type: 'NEW_PACK',
                        profile_id: this.profileID,
                        message: 'New pack from ' + this.username,
                        hyperlink: this.username + "/pack/" + res.pack_id,
                        from_info: {
                          display_name: this.displayName,
                          profile_url: this.username,
                          user_id: this.userId
                        }
                      }
                      this.commonservice.Subscriber_notification(obj).subscribe((res: any) => { })
                      this.toastr.success('Pack added succesfully.');
                      this.commonservice.user_log({ message: 'Pack added succesfully!' }).subscribe(res => { });
                      this.router.navigate(['/creator/profile']);
                    }, err => {
                      this.showSpinner = false;
                      this.isProgressbar = false;
                      this.toastr.error(err.error.message);
                    });
                  }

                });
              });
            }
          });
          //   cnt++;
          // }
        } else {
          this.showSpinner = false;
          this.isProgressbar = false;
        }
      }

      if (this.isEdit) {
        if (this.postCount > 10) {
          this.submitMedia = true;
        } else {
          this.submitMedia = false;
        }
        if ((this.files.length + this.media.image.length + this.media.video.length) === 0) {
          this.postRequired = true;
        } else {
          this.postRequired = false;
        }

        if (this.isCategory || this.isTitle || this.isDescription || this.isCost || this.isSchedule) {
          this.showSpinner = true;
          this.isProgressbar = true;
          let obj = {};

          if (this.isTitle) {
            if (this.postForm.value.title != '') {
              obj['title'] = this.postForm.value.title;
              obj['pack_id'] = this.postID;
            }
          }

          // if (this.isExpire) {
          //   if (this.postForm.value.title !== '') {
          //     obj['expiration'] = this.expireDate;
          //     obj['product_id'] = this.postID;
          //   }
          // }

          if (this.isDescription) {
            if (this.postForm.value.description != '') {
              obj['description'] = this.postForm.value.description;
              obj['pack_id'] = this.postID;
            }
          }

          if (this.isCost) {
            if (this.postForm.value.packCost != '') {
              obj['price'] = this.postForm.value.packCost;
              obj['pack_id'] = this.postID;
            }
          }
          if (this.isSchedule) {
            let dt;

            if (this.scheduleDate > new Date()) {
              this.isLive = false;
            } else {
              this.isLive = true;
            }

            if (this.scheduleDate !== '' || this.scheduleDate !== undefined) {
              dt = moment(this.cronTime, 'YYYY-MM-DD kk:mm:ss').format('YYYY-MM-DD-kk:mm:ss');
            } else {
              dt = moment(new Date(), 'ddd MMM DD YYYY hh:mm:ss').format('YYYY-MM-DD-kk:mm:ss');
            }
            obj['publish_date'] = dt;
            obj['pack_id'] = this.postID;
            obj['live'] = this.isLive;
          }

          if (this.isCategory) {

            obj['pack_category'] = this.category;
            obj['pack_id'] = this.postID;

          }

          this.commonservice.modify_pack(obj).subscribe(res => {
            this.showSpinner = false;
            this.isProgressbar = false;
            this.toastr.success('Pack updated successfully.');
            this.commonservice.user_log({ message: 'Pack updated succesfully!' }).subscribe(res => { });
            this.router.navigate(['/creator/profile']);
          }, err => {
            this.showSpinner = false;
            this.isProgressbar = false;
            this.toastr.error(err.error.message);
          });
        }


        if (this.isPostImage && !this.submitMedia && !this.postRequired) {
          for (let element of this.files) {
            this.onUploadMedia(element).then((res: any) => {
              this.previewImages = res;
            }).then(res => {
              if (this.previewImages.length === this.files.length) {
                this.previewImages.forEach(element => {
                  this.commonservice.update_media_pack(this.postID, element).subscribe(res => {
                    this.toastr.success('Pack updated successfully');
                    this.commonservice.user_log({ message: 'Pack updated succesfully!' }).subscribe(res => { });
                    this.isProgressbar = false;
                    this.showSpinner = false;
                    this.router.navigate(['/creator/profile']);
                  }, err => {
                    this.showSpinner = false;
                    this.isProgressbar = false;
                    this.toastr.error(err.error.message);
                  })
                });

              }
            });
            cnt++;
          }

        }


      }

    }

    if (this.isProduct) {

      if (this.infoRequired.length == 0) {
        this.informationRequire = true;
      } else {

        this.informationRequire = false;
      }

      if (this.postForm.value.deliveryMethod == '') {
        this.deliveryRequire = true;
      } else {

        this.deliveryRequire = false;
      }

      if (this.isAdd) {
        if (this.category === '') {
          this.categoryRequired = true;
        } else {
          this.categoryRequired = false;
        }

        // if (this.expireDate === undefined) {
        //   this.expirationRequired = true;
        // } else {
        //   this.expirationRequired = false;
        // }

        if (valid && !this.postRequired && !this.categoryRequired && !this.informationRequire && !this.deliveryRequire) {
          this.showSpinner = true;
          this.isProgressbar = true;
          // for (let img of this.files) {
          this.onUploadMedia(this.files).then((res: any) => {
            // this.allImages.push(res.data.Location);
            if (this.var1 === res.length) {
              let obj = {
                product_name: this.postForm.value.title,
                product_description: this.postForm.value.description,
                product_image: res,
                product_tags: this.hashArray,
                product_category: this.category,
                delivery_method: this.postForm.value.deliveryMethod,
                info_needed_for_delivery: this.infoRequired,
                price: this.postForm.value.cost,
                quantity_available: this.postForm.value.quantity,
                expiration: this.expireDate,
              };
              this.commonservice.add_product(obj).subscribe((res: any) => {
                this.showSpinner = false;
                this.isProgressbar = false;
                let obj = {
                  event_type: 'NEW_PRODUCT',
                  profile_id: this.profileID,
                  message: 'New product from ' + this.username,
                  hyperlink: this.username + "/product/" + res.product_id,
                  from_info: {
                    display_name: this.displayName,
                    profile_url: this.username,
                    user_id: this.userId
                  }
                }
                this.commonservice.Subscriber_notification(obj).subscribe((res: any) => { })
                this.toastr.success('Product added succesfully.');
                this.commonservice.user_log({ message: 'Product added succesfully!' }).subscribe(res => { });
                this.router.navigate(['/creator/profile']);
              }, err => {
                this.showSpinner = false;
                this.isProgressbar = false;
                this.toastr.error(err.error.message);
              });

            }
          }).catch(err => {
          })
          // }
        }
      }

      if (this.isEdit) {
        if ((this.postCount + this.media.image.length + this.media.video.lengt) === 0) {
          this.postRequired = true;
        } else {
          this.postRequired = false;
        }

        if (this.postCount > 10) {
          this.submitMedia = true;
        } else {
          this.submitMedia = false;
        }

        if (this.isCategory || this.isExpire || this.isTitle || this.isDescription || this.isCost || this.isQty || this.isDelivery || this.isInformation) {
          this.showSpinner = true;
          this.isProgressbar = true;
          let obj = {};

          if (this.isTitle) {
            if (this.postForm.value.title !== '') {
              obj['product_name'] = this.postForm.value.title;
              obj['product_id'] = this.postID;
            }
          }
          if (this.isExpire) {
            if (this.postForm.value.title !== '') {
              obj['expiration'] = this.expireDate;
              obj['product_id'] = this.postID;
            }
          }

          if (this.isDescription) {
            if (this.postForm.value.description !== '') {
              obj['product_description'] = this.postForm.value.description;
              obj['product_tags'] = this.hashArray;
              obj['product_id'] = this.postID;
            }
          }
          if (this.isCategory) {
            obj['product_category'] = this.category;
            obj['product_id'] = this.postID;

          }

          if (this.isCost) {
            if (this.postForm.value.cost !== '') {
              obj['price'] = this.postForm.value.cost;
              obj['product_id'] = this.postID;
            }
          }
          if (this.isQty) {
            if (this.postForm.value.quantity !== '') {
              obj['quantity_available'] = this.postForm.value.quantity;
              obj['product_id'] = this.postID;
            }
          }
          if (this.isDelivery) {
            if (this.postForm.value.deliveryMethod !== '') {
              obj['delivery_method'] = this.postForm.value.deliveryMethod;
              obj['product_id'] = this.postID;
            }
          }
          if (this.isInformation) {
            if (this.postForm.value.requiredInformation !== '') {
              obj['info_needed_for_delivery'] = this.postForm.value.requiredInformation;
              obj['product_id'] = this.postID;
            }
          }
          // if (this.isExpire) {
          //   if (this.postForm.value.expiryDate !== '') {
          //     obj['expiration'] = moment(this.postForm.value.expiryDate).format('YYYY-MM-DD-hh:mm:ss'),
          //       obj['product_id'] = this.postID;
          //   }
          // }
          this.commonservice.modify_product(obj).subscribe(res => {
            this.showSpinner = false;
            this.isProgressbar = false;
            this.toastr.success('Product updated successfully');
            this.commonservice.user_log({ message: 'Product updated succesfully!' }).subscribe(res => { });
            this.router.navigate(['/creator/profile']);
          }, err => {
            this.showSpinner = false;
            this.isProgressbar = true;
            this.toastr.error(err.error.message);
          });
        }
        if (this.isPostImage && !this.submitMedia && !this.postRequired) {
          for (let element of this.files) {
            this.onUploadMedia(element).then((res: any) => {
              this.allImages = res;
            }).then(res => {
              if (this.allImages.length === this.files.length) {
                this.allImages.forEach(element => {
                  this.commonservice.update_media_product(this.postID, element).subscribe(res => {
                    this.showSpinner = false;
                    this.isProgressbar = false;
                    this.toastr.success('Product updated successfully');
                    this.commonservice.user_log({ message: 'Product updated succesfully!' }).subscribe(res => { });
                    this.router.navigate(['/creator/profile']);
                  }, err => {
                    this.showSpinner = false;
                    this.isProgressbar = false;
                    this.toastr.error(err.error.message);
                  })
                });

              }
            });
            cnt++;
          }

        }

      }

    }

    if (this.isExclusive) {
      if (this.isAdd) {

        if (this.category === '') {
          this.categoryRequired = true;
        } else {
          this.categoryRequired = false;
        }
        if (valid && !this.postRequired && !this.categoryRequired) {
          this.showSpinner = true;
          this.isProgressbar = true;
          // for (const element of this.files) {
          this.onUploadMedia(this.files).then((res: any) => {
            this.allImages = res;
            if (this.var1 === res.length) {

              this.onUploadMedia(this.previewImages).then((file: any) => {
                this.exclusivePreview = file;
              }).then(res => {
                if (this.previewImages.length === this.exclusivePreview.length) {
                  let obj = {
                    title: this.postForm.value.title,
                    description: this.postForm.value.description,
                    exclusive_content: this.allImages,
                    exclusive_category: this.category,
                    min_contribution: parseInt(this.postForm.value.minimumContribution, 10),
                    nsfw: false,
                    goal: this.postForm.value.goal,
                    available_now: this.isAvail,
                    media: this.exclusivePreview
                    // expiration: this.expireDate,
                  };

                  this.commonservice.add_exclusive(obj).subscribe((res: any) => {
                    this.showSpinner = false;
                    this.isProgressbar = false;
                    let obj = {
                      event_type: 'NEW_EXCLUSIVE',
                      profile_id: this.profileID,
                      message: 'New exclusive from ' + this.username,
                      hyperlink: this.username + "/exclusive/" + res.exclusive_id,
                      from_info: {
                        display_name: this.displayName,
                        profile_url: this.username,
                        user_id: this.userId
                      }
                    }
                    this.commonservice.Subscriber_notification(obj).subscribe((res: any) => { })
                    this.toastr.success('Exclusive is Successfuly Uploaded');
                    this.commonservice.user_log({ message: 'Exclusive added succesfully!' }).subscribe(res => { });
                    this.router.navigate(['/creator/profile']);
                  }, err => {
                    this.showSpinner = false;
                    this.isProgressbar = false;
                    this.toastr.error('Having issue while upload Exclusive');
                  });
                }
              })




            }
          })
          // }
        } else {
          this.showSpinner = false;
          this.isProgressbar = false;
        }
      }
      if (this.isEdit) {

        if (this.postCount === 0) {
          this.postRequired = true;
        } else {
          this.postRequired = false;
        }

        if (this.postCount > 10) {
          this.submitMedia = true;
        } else {
          this.submitMedia = false;
        }

        if (this.isCategory || this.isTitle || this.isDescription || this.isGoal || this.isContribution || this.isContentChange) {
          this.isProgressbar = true;
          this.showSpinner = true;
          let obj = {};
          if (this.isTitle) {
            obj['title'] = this.postForm.value.title;
            obj['exclusive_id'] = this.postID;
          }

          if (this.isDescription) {
            obj['description'] = this.postForm.value.description;
            obj['exclusive_id'] = this.postID;
          }

          // if (this.isExpire) {
          //   if (this.postForm.value.title !== '') {
          //     obj['expiration'] = this.expireDate;
          //     obj['product_id'] = this.postID;
          //   }
          // }

          if (this.isContribution) {
            obj['min_contribution'] = this.postForm.value.minimumContribution;
            obj['exclusive_id'] = this.postID;
          }

          if (this.isGoal) {
            obj['goal'] = this.postForm.value.goal;
            obj['exclusive_id'] = this.postID;
          }

          if (this.isCategory) {
            obj['exclusive_category'] = this.category;
            obj['exclusive_id'] = this.postID;
          }


          if (this.isContentChange) {
            obj['available_now'] = this.isAvail;
            obj['exclusive_id'] = this.postID;
          }




          this.commonservice.modify_exclusive(obj).subscribe(res => {
            this.showSpinner = false;
            this.isProgressbar = false;
            this.toastr.success('Exclusive updated successfully');
            this.commonservice.user_log({ message: 'Exclusive Updated succesfully!' }).subscribe(res => { });
            this.router.navigate(['/creator/profile']);
          }, err => {
            this.showSpinner = false;
            this.isProgressbar = false;
            this.toastr.error(err.error.message);
          });
        }


        if (!this.postRequired && this.isPostImage && !this.submitMedia) {
          if (this.inContent) {
            this.showSpinner = true;
            this.isProgressbar = true;
            // for (let element of this.files) {
            this.onUploadMedia(this.files).then((res: any) => {
              this.allImages = res;
            }).then(res => {

              if (this.allImages.length === this.files.length) {
                this.allImages.forEach(element => {
                  this.commonservice.update_content('add', this.postID, element).subscribe(res => {
                    this.showSpinner = false;
                    this.isProgressbar = false;
                    this.toastr.success('Media uploaded succesfully');
                    this.commonservice.user_log({ message: 'Exclusive Updated succesfully!' }).subscribe(res => { });
                    this.router.navigate(['/creator/profile']);
                  }, err => {
                    this.toastr.error(err.error.message);
                    this.isProgressbar = false;
                    this.showSpinner = false;
                  });
                });
              }
            }).then(res => {
              this.isProgressbar = false;
              this.showSpinner = false;
            }).catch(err => {
              this.isProgressbar = false;
              this.showSpinner = false;
            });
            //   cnt++;
            // }
          }

          if (this.inPreview) {

            this.showSpinner = true;
            this.isProgressbar = true;
            this.onUploadMedia(this.previewImages).then((res: any) => {
              this.allImages = res;
            }).then(res => {
              if (this.allImages.length === this.files.length) {
                this.allImages.forEach(element => {
                  this.commonservice.update_media_exclusive(this.postID, element).subscribe(res => {
                    this.showSpinner = false;
                    this.isProgressbar = false;
                    this.toastr.success('Media uploaded succesfully');
                    this.commonservice.user_log({ message: 'Exclusive Updated succesfully!' }).subscribe(res => { });
                    this.router.navigate(['/creator/profile']);
                  }, err => {
                    this.toastr.error(err.error.message);
                    this.isProgressbar = false;
                    this.showSpinner = false;
                  });
                });
              }
            }).then(res => {
              this.isProgressbar = false;
              this.showSpinner = false;
            }).catch(err => {
              this.isProgressbar = false;
              this.showSpinner = false;
            });

          }
        }







      }

    }


  }





}
