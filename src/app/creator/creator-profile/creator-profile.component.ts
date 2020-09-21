import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, ConfirmationService } from 'primeng/api';
import { ImageViewerConfig } from 'ngx-image-viewer';
import { CommonService } from 'src/app/service/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Element } from '@angular/compiler';
@Component({
  selector: 'app-creator-profile',
  templateUrl: './creator-profile.component.html',
  styleUrls: ['./creator-profile.component.css']
})
export class CreatorProfileComponent implements OnInit {
  editProfileForm: FormGroup;
  postID: any;
  images = ['assets/s1.jpg', 'assets/s2.jpg'];
  items: MenuItem[];
  isClose = false;
  isProfile = false;
  commentArr: any = [];
  modalRef: BsModalRef;
  profileData: any;
  commentsArray: any = [];
  userName: any;
  imageIndexOne = 0;
  image: any;
  msg: any;;
  displayName: any;
  birthdate: any;
  profilePicture: any;
  profileVideo: any;
  isTimeline = false;
  timelineImage: any;
  commnetUID: any = [];
  isUpdateComment = false;
  about: any;
  location: any;

  showSpinner = false;
  updateDisplayName: any;
  updateBirthdate: any;
  updateProfilePicture: any;
  updateProfileVideo: any;
  updateAbout: any;
  updateCategory: any;
  updateLocation: any;
  updateWebsite: any
  userDetails: any = [];
  ImageURL: any;
  isDisplayName = false;
  isBirthdate = false;
  isProfilePicture = false;
  isProfileVideo = false;
  isAbout = false;
  isLocation = false;
  isWebsite = false;
  isCategory = false;
  videoURL: any;
  profileImage: any;
  minYear = moment(new Date(new Date().setFullYear(new Date().getFullYear() - 50))).format('YYYY');
  maxYear = moment(new Date()).format('YYYY');
  isVideo = false;
  isComments = false;
  filter: String;
  postmedias: any = [];
  packmedias: any = [];
  productmedias: any = [];
  exclusivemedias: any = [];

  posts: any = [];
  packs: any = [];
  isPost = false;
  isPack = false;
  isProduct = false;
  isExclusive = false;
  products: any = [];
  exclusive: any = []
  allData: any = [];
  postType: any;
  publishDate = 0;
  currentDate = 0;
  createdDate = 0;
  isVerified = false;
  comments: any = [];
  votes: any = [];

  isVote6 = false;
  isVote7 = false;
  isVote8 = false;
  isVote9 = false;
  isVote10 = false;
  isTag = false;
  comment: any;
  showCommentBox: boolean;
  tags: any = [];
  userId: any = [];
  totalSubsciber = 0;
  totalFollowing = 0
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
  postLength = 0;
  files: File[] = [];
  filesTimelines: File[] = [];
  filesVideos: File[] = [];
  updateProfileImage: any = [];
  updateTimelineImage: any = [];
  language: any = [];
  isNewProfileImage = false;
  isNewTimelineImage = false;
  isNewProfileVideo = false;
  isMoreProfileImage = false;
  isMoreTimelineImage = false;
  isMoreProfileVideo = false;
  start = 0;
  limit = 5;
  languagesList = [
    { label: 'English', value: 'english' },
    { label: 'Spanish', value: 'spanish' }
  ];
  categoryList = [
    { label: 'Please Select any', value: '' }
  ];
  totalVotes = 0;
  total6 = 0;
  total7 = 0;
  total8 = 0;
  total9 = 0;
  total10 = 0;
  mediaImages: any = [];
  isOpenImages = false;
  profilevideo: any;
  havePost = false;
  tagArray: any = [];
  allImages: any = [];
  bucketName: any;
  token: any;
  constructor(
    private toastr: ToastrService,

    private router: Router,
    private commonservice: CommonService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private confirmationService: ConfirmationService,
    private http: HttpClient,
  ) {
    this.spinner.show();
    this.userDetails = this.commonservice.getLoggedUserDetail();

    this.commonservice.get_userDetail().subscribe((res: any) => {
      if (res.doc_status === 'APPROVED') {
        this.isVerified = true;
      } else {
        this.isVerified = false;
      }

      if (res.language) {
        this.language = res.language;
      }
    });


    this.getDetail().then((res: any) => {
      this.profileData = res;
      this.displayName = res.display_name;
      this.commonservice.getTags(res.user_id).subscribe((res: any) => {

        this.tags = res;
        this.isTag = true;
      });
      this.onDownloadMedia(res.profile_picture).then(image => {
        this.profilePicture = image;
      })

      this.userName = this.userDetails.username;
      this.birthdate = res.birthdate;
      this.location = res.location;
      this.about = res.about;
      this.totalSubsciber = res.subscribers_list.length;
      this.totalFollowing = res.subscription_list.length;
      this.postLength = res.post_count;
      this.userId = res.user_id;
      if (res.profile_video) {
        this.isVideo = true;
        this.onDownloadMedia(res.profile_video).then((video) => {
          this.profileVideo = video;
        });
      }

      if (res.timeline_picture) {
        this.isTimeline = true;
        this.onDownloadMedia(res.timeline_picture).then(image => {
          this.timelineImage = image;
        });
      }



      if (this.displayName === undefined) {
        this.spinner.hide();
      }

    }).catch(err => {
      this.spinner.hide();
      this.toastr.error(err.error);
    });

    this.commonservice.getupdatedUserDetail.subscribe((res: any) => {
      if (res.display_name) {
        this.displayName = res.display_name;
      }
      this.userName = this.userDetails.username;
      if (res.birthdate) {
        this.birthdate = moment(res.birthdate, 'YYYY-MM-DD-kk:mm:ss').format('MM/DD/YYYY hh:mm');;
      }
      if (res.location) {
        this.location = res.location;
      }

      if (res.about) {
        this.about = res.about;
      }

      if (res.profile_picture) {
        this.profilePicture = res.profile_picture;
      }

      if (res.profile_video) {
        this.isVideo = true;
        this.profileVideo = res.profile_video;
      }

      if (res.timeline_picture) {
        this.isTimeline = true;
        this.timelineImage = res.timeline_picture;
      }
    });


    this.allPost();
  }

  async creatorFeed() {
    return new Promise((pass, fail) => {
      this.commonservice.profile_creator().subscribe(res => {
        pass(res);
      }, err => {
        fail(err);
      });
    });
  }


  loadMore(arr) {
    this.start = this.start + this.limit;
    this.commonservice.get_comments_post(arr.post_id, this.start, this.limit).subscribe((res: any) => {

      if (res.length > 0) {
        arr.total_comments = res.length;
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
                })
              });


            });
          }
        });

      }
    });
  }

  allPost() {
    this.creatorFeed().then((res: any) => {
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
            let postmedias = {
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
                  postmedias.image.push(res);
                })
              } else {
                this.postVideoCount++;
                this.onDownloadMedia(element).then(res => {
                  postmedias.video.push(res);
                })
              }
              e['medias'] = postmedias;
            });
          }
          let dt1 = this.commonservice.scheduleDate(e.publish_date);
          e.publish_date = moment(dt1, 'YYYY-MM-DD').format('MMM DD');
          let checkDate = moment(dt1, 'YYYY-MM-DD').format('MM/DD/YYYY');
          let todaydate = moment(new Date()).format('MM/DD/YYYY');
          e.isDelete = true;
          if ((moment(todaydate).diff(moment(checkDate), 'days') >= 0 && moment(todaydate).diff(moment(checkDate), 'days') <= 3 || e.live === false)) {
            e.isUpdate = true;

          } else if ((moment(todaydate).diff(moment(checkDate), 'days') < 0 || moment(todaydate).diff(moment(checkDate), 'days') > 3 && e.live === true)) {
            e.isUpdate = false;
          }

          e.votes.forEach(vote => {
            if ((vote.ten + vote.nine + vote.eight + vote.seven + vote.six) > 0) {
              e.totalVotes = vote.ten + vote.nine + vote.eight + vote.seven + vote.six;
            } else {
              e.totalVotes = 0;
            }
          });

          if (e.score >= 100 && e.totalVotes > 0) {
            e.is100 = true;
          }
          if (e.score >= 90 && e.score <= 90) {
            e.is90 = true;
          }
          if (e.score >= 89 && e.score <= 80) {
            e.is80 = true;
          }
          if (e.score >= 79 && e.score <= 70) {
            e.is70 = true;
          }
          if (e.score <= 60) {
            e.is60 = true;
          }

        });

      }

      if (this.allData.packs) {
        this.allData.packs.forEach((e, index) => {

          e.isDelete = true;
          let dt1 = this.commonservice.scheduleDate(e.publish_date);
          e.publish_date = moment(dt1, 'YYYY-MM-DD').format('MMM DD');
          let checkDate = moment(dt1, 'YYYY-MM-DD').format('MM/DD/YYYY');
          let todaydate = moment(new Date()).format('MM/DD/YYYY');

          if (e.live === false) {
            e.isUpdate = true;
          } else {
            if (moment(todaydate).diff(moment(checkDate), 'days') >= 0 && moment(todaydate).diff(moment(checkDate), 'days') <= 3) {
              e.isUpdate = true;

            } else if (moment(todaydate).diff(moment(checkDate), 'days') < 0 || moment(todaydate).diff(moment(checkDate), 'days') > 3) {
              e.isUpdate = false;

            }
          }


          if (e.preview_media) {
            let packmedias = {
              image: [],
              video: []
            };
            e.preview_media.forEach(async element => {
              const isImages = ['jpg', 'jpeg', 'png', 'webp'];
              const isVideo = ['mp4'];
              const imgStr = isImages.join(',');
              const videoStr = isVideo.join(',');
              if (imgStr.includes(element.split('.').pop()) === true) {
                this.packImageCount++;

                this.onDownloadMedia(element).then((res: any) => {
                  packmedias.image.push(res);
                })
              } else {
                this.packVideoCount++;
                this.onDownloadMedia(element).then((res: any) => {
                  packmedias.video.push(res);
                })
              }

              e['medias'] = packmedias;
            });
          }
        });
      }

      if (this.allData.products) {
        this.allData.products.forEach(e => {
          if (e.product_tags.length > 0) {
            e.tag = true;
            e.product_tags.forEach(e => {
              if (this.tagArray.length < 5) {

                this.tagArray.push(e);
              }
            });
            e.product_tags = this.tagArray;
          }
          e.isDelete = true;
          let dt1 = this.commonservice.scheduleDate(e.created_at);
          e.created_at = moment(dt1, 'YYYY-MM-DD').format('MMM DD');
          let checkDate = moment(dt1, 'YYYY-MM-DD').format('MM/DD/YYYY');
          let todaydate = moment(new Date()).format('MM/DD/YYYY');
          if (moment(todaydate).diff(moment(checkDate), 'days') >= 0 && moment(todaydate).diff(moment(checkDate), 'days') <= 3) {
            e.isUpdate = true;

          } else if (moment(todaydate).diff(moment(checkDate), 'days') < 0 || moment(todaydate).diff(moment(checkDate), 'days') > 3) {
            e.isUpdate = false;

          }

          if (e.product_image) {
            let productmedias = {
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
                  productmedias.image.push(res);
                })
              } else {
                this.productVideoCount++;
                this.onDownloadMedia(element).then(res => {
                  productmedias.video.push(res);
                })
              }
              e['medias'] = productmedias;
            });
          }
        });
      }
      if (this.allData.exclusives) {
        this.allData.exclusives.forEach(e => {

          e.isDelete = true;
          let dt1 = this.commonservice.scheduleDate(e.created_on);
          e.created_on = moment(dt1, 'YYYY-MM-DD').format('MMM DD');
          let checkDate = moment(dt1, 'YYYY-MM-DD').format('MM/DD/YYYY');
          let todaydate = moment(new Date()).format('MM/DD/YYYY');
          if (moment(todaydate).diff(moment(checkDate), 'days') >= 0 && moment(todaydate).diff(moment(checkDate), 'days') <= 3) {
            e.isUpdate = true;
          } else if (moment(todaydate).diff(moment(checkDate), 'days') < 0 || moment(todaydate).diff(moment(checkDate), 'days') > 3) {
            e.isUpdate = false;
          }

          if (moment(todaydate).diff(moment(checkDate), 'days') >= 0 && moment(todaydate).diff(moment(checkDate), 'days') <= 7) {
            e.allowContent = true;
          } else {
            e.allowContent = false;
          }

          if (e.exclusive_content) {

            let exclusivemedias = {
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
                  exclusivemedias.image.push(res);
                })
              } else {
                this.exclusiveVideoCount++;
                this.onDownloadMedia(element).then(res => {
                  exclusivemedias.video.push(res);
                })
              }
              e.medias = exclusivemedias;
            });
          }


        });
      }
      if (this.allData.posts !== '' || this.allData.packs !== '' || this.allData.products !== '' || this.allData.exclusives !== '') {
        this.spinner.hide();
      } else {
        this.spinner.hide();
      }

      if (this.allData.posts.length == 0 && this.allData.packs.length == 0 && this.allData.products.length == 0 && this.allData.exclusives.length == 0) {
        this.havePost = false;
      } else {

        this.havePost = true;
      }
      this.totalImageCount = this.postImageCount + this.packImageCount + this.productImageCount + this.exclusiveImageCount;
      this.totalVideoCount = this.postVideoCount + this.packVideoCount + this.productVideoCount + this.exclusiveVideoCount;
    });

  }

  onSelectImage(event) {
    if (event.addedFiles.length === 1) {
      this.isMoreProfileImage = false;
      this.isNewProfileImage = true;
      this.files = [];
      this.files = event.addedFiles;
    } else {
      this.isMoreProfileImage = true;
    }
  }


  onSelectTimeline(event) {
    if (event.addedFiles.length === 1) {
      this.isMoreTimelineImage = false;
      this.isNewTimelineImage = true;
      this.filesTimelines = event.addedFiles;
    } else {
      this.isMoreTimelineImage = true;
    }
  }
  onSelectVideo(event) {
    if (event.addedFiles.length === 1) {
      this.isMoreProfileVideo = false;
      this.isNewProfileVideo = true;
      this.filesVideos = event.addedFiles;
    } else {
      this.isMoreProfileVideo = true;
    }
  }

  viewProfile(key) {
    this.router.navigate(['/mi.show/' + key]);
  }


  Filter(key) {
    this.allData = [];
    this.spinner.show();
    if (key === 'pack') {
      this.isPack = true;
      this.isPost = false;
      this.isProduct = false;
      this.isExclusive = false;
      this.commonservice.get_pack().subscribe(res => {
        this.spinner.hide();
        this.packs = res;
        this.packs.forEach(e => {
          let dt1 = this.commonservice.scheduleDate(e.publish_date);
          e.publish_date = moment(dt1, 'YYYY-MM-DD').format('MMM DD');
          let checkDate = moment(dt1, 'YYYY-MM-DD').format('MM/DD/YYYY');
          let todaydate = moment(new Date()).format('MM/DD/YYYY');
          if (moment(todaydate).diff(moment(checkDate), 'days') >= 0 && moment(todaydate).diff(moment(checkDate), 'days') <= 3) {
            e.isUpdate = true;
          } else if (moment(todaydate).diff(moment(checkDate), 'days') < 0 || moment(todaydate).diff(moment(checkDate), 'days') > 3) {
            e.isUpdate = false;
          }
          e.isDelete = true;
          if (e.preview_media) {
            let packmedias = {
              image: [],
              video: []
            };
            e.preview_media.forEach(element => {
              const isImages = ['jpg', 'jpeg', 'png', 'webp'];
              const isVideo = ['mp4'];
              const imgStr = isImages.join(',');
              const videoStr = isVideo.join(',');
              if (imgStr.includes(element.split('.').pop()) === true) {
                // this.packmedias.image.push(element);
                this.onDownloadMedia(element).then(res => {
                  packmedias.image.push(res);
                })
              } else {
                // this.packmedias.video.push(element);
                this.onDownloadMedia(element).then(res => {
                  packmedias.video.push(res);
                })
              }
              e['medias'] = packmedias;
            });
          }
        });
      });
    } else if (key === 'post') {
      this.isPack = false;
      this.isPost = true;
      this.isProduct = false;
      this.isExclusive = false;
      this.getPost().then((res: any) => {


        this.posts = res;
        this.posts.forEach(e => {

          if (e.tags.length > 0) {
            e.tag = true;
            e.tags.forEach(e => {
              if (this.tagArray.length < 5) {

                this.tagArray.push(e);
              }
            });
            e.tags = this.tagArray;
          }
          let dt1 = this.commonservice.scheduleDate(e.publish_date);
          e.publish_date = moment(dt1, 'YYYY-MM-DD').format('MMM DD');
          let checkDate = moment(dt1, 'YYYY-MM-DD').format('MM/DD/YYYY');
          let todaydate = moment(new Date()).format('MM/DD/YYYY');
          if (moment(todaydate).diff(moment(checkDate), 'days') >= 0 && moment(todaydate).diff(moment(checkDate), 'days') <= 3) {
            e.isUpdate = true;
          } else if (moment(todaydate).diff(moment(checkDate), 'days') < 0 || moment(todaydate).diff(moment(checkDate), 'days') > 3) {
            e.isUpdate = false;
          }
          e.isDelete = true;

          if (e.comments === true && e.total_comments) {
            this.commonservice.get_comments_post(e.post_id, this.start, this.limit).subscribe((res: any) => {
              if (res.length > 0) {
                e.commentArr = res;
                e.commentArr.forEach(ele => {
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

          this.commonservice.getAllVotes(e.post_id).subscribe((vote: any) => {
            console.log('vote=>', vote);

            if (vote) {
              e.votes = vote;

              if ((vote.ten + vote.nine + vote.eight + vote.seven + vote.six) > 0) {
                e.totalVotes = vote.ten + vote.nine + vote.eight + vote.seven + vote.six;
              } else {
                e.totalVotes = 0;
              }


              if (e.score >= 100 && e.totalVotes > 0) {
                e.is100 = true;
              }
              if (e.score >= 90 && e.score <= 90) {
                e.is90 = true;
              }
              if (e.score >= 89 && e.score <= 80) {
                e.is80 = true;
              }
              if (e.score >= 79 && e.score <= 70) {
                e.is70 = true;
              }
              if (e.score <= 60) {
                e.is60 = true;
              }
            }

          });

          if (e.media) {
            let postmedias = {
              image: [],
              video: []
            };
            e.media.forEach(element => {
              const isImages = ['jpg', 'jpeg', 'png', 'webp'];
              const isVideo = ['mp4'];
              const imgStr = isImages.join(',');
              const videoStr = isVideo.join(',');
              if (imgStr.includes(element.split('.').pop()) === true) {
                // this.postmedias.image.push(element);
                this.onDownloadMedia(element).then(res => {
                  postmedias.image.push(res);
                })
              } else {
                // this.postmedias.video.push(element);
                this.onDownloadMedia(element).then(res => {
                  postmedias.video.push(res);
                })
              }
              e['medias'] = postmedias;
            });
          }

        });
        this.spinner.hide();

      });
    } else if (key === 'product') {
      this.isPack = false;
      this.isProduct = true;
      this.isPost = false;
      this.isExclusive = false;
      this.commonservice.get_product().subscribe(res => {
        this.spinner.hide();
        this.products = res;
        this.products.forEach(e => {

          if (e.product_tags.length > 0) {
            e.tag = true;
            e.product_tags.forEach(e => {
              if (this.tagArray.length < 5) {

                this.tagArray.push(e);
              }
            });
            e.product_tags = this.tagArray;
          }
          let dt1 = this.commonservice.scheduleDate(e.created_at);
          e.created_at = moment(dt1, 'YYYY-MM-DD').format('MMM DD');
          let checkDate = moment(dt1, 'YYYY-MM-DD').format('MM/DD/YYYY');
          let todaydate = moment(new Date()).format('MM/DD/YYYY');
          if (moment(todaydate).diff(moment(checkDate), 'days') >= 0 && moment(todaydate).diff(moment(checkDate), 'days') <= 3) {
            e.isUpdate = true;
          } else if (moment(todaydate).diff(moment(checkDate), 'days') < 0 || moment(todaydate).diff(moment(checkDate), 'days') > 3) {
            e.isUpdate = false;
          }

          if (e.product_image) {
            let productmedias = {
              image: [],
              video: []
            };
            e.isDelete = true;
            e.product_image.forEach(element => {
              const isImages = ['jpg', 'jpeg', 'png', 'webp'];
              const isVideo = ['mp4'];
              const imgStr = isImages.join(',');
              const videoStr = isVideo.join(',');
              if (imgStr.includes(element.split('.').pop()) === true) {
                // this.productmedias.image.push(element);
                this.onDownloadMedia(element).then(res => {
                  productmedias.image.push(res);
                })
              } else {
                // this.productmedias.video.push(element);
                this.onDownloadMedia(element).then(res => {
                  productmedias.video.push(res);
                })
              }
              e['medias'] = productmedias;
            });
          }
        });
      });


    } else if (key === 'exclusive') {
      this.isPack = false;
      this.isProduct = false;
      this.isExclusive = true;
      this.isPost = false;
      this.commonservice.get_exclusive().subscribe(res => {
        this.spinner.hide();
        this.exclusive = res;
        this.exclusive.forEach(e => {
          let dt1 = this.commonservice.scheduleDate(e.created_on);
          e.created_on = moment(dt1, 'YYYY-MM-DD').format('MMM DD');
          let checkDate = moment(dt1, 'YYYY-MM-DD').format('MM/DD/YYYY');
          let todaydate = moment(new Date()).format('MM/DD/YYYY');
          if (moment(todaydate).diff(moment(checkDate), 'days') >= 0 && moment(todaydate).diff(moment(checkDate), 'days') <= 3) {
            e.isUpdate = true;
          } else if (moment(todaydate).diff(moment(checkDate), 'days') < 0 || moment(todaydate).diff(moment(checkDate), 'days') > 3) {
            e.isUpdate = false;
          }
          e.isDelete = true;
          if (e.media) {
            let exclusivemedias = {
              image: [],
              video: []
            };
            e.media.forEach(element => {
              const isImages = ['jpg', 'jpeg', 'png', 'webp'];
              const isVideo = ['mp4'];
              const imgStr = isImages.join(',');
              const videoStr = isVideo.join(',');
              if (imgStr.includes(element.split('.').pop()) === true) {
                // this.exclusivemedias.image.push(element);
                this.onDownloadMedia(element).then(res => {
                  exclusivemedias.image.push(res);
                })
              } else {
                // this.exclusivemedias.video.push(element);
                this.onDownloadMedia(element).then(res => {
                  exclusivemedias.video.push(res);
                })
              }
              e['medias'] = exclusivemedias;
            });
          }
        });
      });
    } else if (key === 'all') {
      this.allPost();
    }

  }

  open(temp, arr) {
    this.modalRef = this.modalService.show(temp, { class: 'MediaPopup modal-lg' });
    this.isOpenImages = true;
    // this.router.navigate(['mi.show/' + this.userName + '/' + type + '/' + id]);
    this.mediaImages = arr;
  }

  onFileChange(e, value) {
    this.isProfilePicture = true;
    this.profileImage = value.target.files[0];
  }

  onFileChangeVideo(e, value) {
    this.isProfileVideo = true;
    this.profilevideo = value.target.files[0];
  }

  async getDetail() {
    return new Promise((pass, fail) => {
      this.commonservice.get_profile().subscribe((res: any) => {
        pass(res);
      }, err => {
        fail(err);
      });
    });
  }

  Voting(vote, id) {
    this.spinner.show();
    if (vote === '10') {
      let obj = {
        post_id: id,
        vote: 'ten'
      };
      this.commonservice.voting(obj).subscribe(res => {
        this.toastr.success('Voted successfully.');
        this.spinner.hide();
        this.allPost();
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.message00);
      });
    }
    if (vote === '9') {

      let obj = {
        post_id: id,
        vote: 'nine'
      };
      this.commonservice.voting(obj).subscribe(res => {
        this.toastr.success('Voted successfully.');
        this.spinner.hide();
        this.allPost();
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.message);
      });
    }
    if (vote === '8') {

      let obj = {
        post_id: id,
        vote: 'eight'
      };
      this.commonservice.voting(obj).subscribe(res => {
        this.toastr.success('Voted successfully.');
        this.spinner.hide();
        this.allPost();
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.message);
      });
    }
    if (vote === '7') {

      let obj = {
        post_id: id,
        vote: 'seven'
      };
      this.commonservice.voting(obj).subscribe(res => {
        this.toastr.success('Voted successfully.');
        this.spinner.hide();
        this.allPost();
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.message);
      });
    }
    if (vote === '6') {

      let obj = {
        post_id: id,
        vote: 'six'
      };
      this.commonservice.voting(obj).subscribe(res => {
        this.toastr.success('Voted successfully.');
        this.spinner.hide();
        this.allPost();
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.message);
      });
    }
  }

  showComment(post) {
    post.showCommentBox = true;
  }

  onComment(e) {
    this.comment = e.target.value;
  }

  AddComment(key, id) {
    this.spinner.show();
    if (key === 'modify') {
      let obj = {
        comment_uid: id,
        comment: this.comment
      }
      this.commonservice.update_comment(obj).subscribe(res => {
        this.allPost();
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
        post_id: id,
        comment: this.comment
      }
      this.commonservice.comment(obj).subscribe(res => {
        this.allPost();
        this.toastr.success('Commented successfully.');
        this.spinner.hide();
        this.commonservice.user_log({ message: 'User commneted post successfully!' }).subscribe(res => { });
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.message);
      });
    } else if (key === 'reply') {
      this.commonservice.reply_comment(id, { comment: this.comment }).subscribe(rse => {
        this.allPost();
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
    if (arr.comments === true && arr.total_comments) {
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
                  })
                });


              });
            }
          });

        }
      });
    }
  }

  likeComment(arr) {
    this.spinner.show();
    this.commonservice.like_comment(arr.comment_uid).subscribe(res => {
      this.toastr.success('Like  the comment!');
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
    this.commentArr = arr;
    arr.replaytoComment = true;
  }

  formInit = () => {
    this.editProfileForm = new FormGroup({
      display_name: new FormControl(''),
      birthdate: new FormControl(''),
      about: new FormControl(''),
      location: new FormControl(''),
      website: new FormControl(''),
      category: new FormControl(''),
    });
  }

  ngOnInit() {

  }

  update(key, id) {
    // if (key === 'post') {
    this.router.navigate(['/creator/edit/' + key + '/' + id]);
    // }
    // else if (key === 'pack') {
    //   this.router.navigate(['/creator/edit/' + key + '/' + id]);
    // }
    // else if (key === 'product') {
    //   this.router.navigate(['/creator/edit/' + key + '/' + id]);
    // }
    // else if (key === 'exclusive') {
    //   this.router.navigate(['/creator/edit/' + key + '/' + id]);
    // }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  editProfile(temp) {
    this.commonservice.get_all_category().subscribe((res: any) => {
      res.forEach(e => {
        this.categoryList.push({ label: e.category_name, value: e.category_name });
      });
    });
    this.modalRef = this.modalService.show(temp, { class: 'EditPopup modal-lg' });
    this.formInit();
    this.getDetail().then((res: any) => {
      this.updateDisplayName = res.display_name;
      this.updateBirthdate = moment(res.birthdate, 'YYYY-MM-DD-kk:mm:ss').format('MM/DD/YYYY hh:mm');
      this.updateLocation = res.location;
      this.updateAbout = res.about;
      this.updateWebsite = res.website;
      this.updateProfilePicture = res.profile_picture;
      this.updateProfileVideo = res.profile_video;
      this.updateCategory = res.category;
      this.spinner.hide();

    }, err => {
      this.toastr.error(err.error);
      this.spinner.hide();
    });
  }

  onOptionClick(key, id) {
    this.postType = key;
    this.postID = id;
  }

  delete(key, arr) {

    if (key !== 'exclusive') {
      // this.confirmationService.confirm({
      //   message: 'Are you sure  you want to Delete?',
      //   accept: () => {
      this.spinner.show();
      if (key === 'post') {
        this.commonservice.delete_post(arr.post_id).subscribe(res => {
          this.toastr.success('Post Deleted Successfully');
          this.spinner.hide()
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
          arr.isDelete = false;
          this.commonservice.user_log({ message: 'Product deleted succesfully!' }).subscribe(res => { });
        }, err => {
          this.toastr.error(err.error.message);
        });
      }
      //   }
      // });
    }

    if (key === 'exclusive') {
      // this.confirmationService.confirm({
      //   message: 'If you delete this exclusive all the funds will be reversed to users who contributed!',
      //   accept: () => {
      this.spinner.show();
      this.commonservice.delete_exclusive(arr.exclusive_id).subscribe(res => {
        this.toastr.success('Exclusive Deleted Successfully');
        this.spinner.hide();
        arr.isDelete = false;
        this.commonservice.user_log({ message: 'Exclusive deleted succesfully!' }).subscribe(res => { });
      }, err => {
        this.toastr.error(err.error.message);
      });

      //   }
      // });
    }
  }
  updateComment(arr) {
    this.commentArr = arr;
    arr.isModify = true;
  }

  deleteComment(key, arr, replyArr) {
    this.spinner.show();
    this.confirmationService.confirm({
      message: 'Are you sure  you want to Delete?',
      accept: () => {
        if (key === 'comment') {
          this.commonservice.delete_comments(arr.comment_uid, 0, 5).subscribe(res => {
            this.toastr.success('Comment Deleted Successfully!');
            this.commonservice.user_log({ message: 'User deleted commnent successfully!' }).subscribe(res => { });
            arr.isDelete = true;
            this.allPost();
            this.spinner.hide();
          }, err => {
            this.spinner.hide();
            this.toastr.error(err.error.message);
          })
        } else if (key === 'reply') {
          this.commonservice.delete_reply(arr.comment_uid, replyArr.comment_uid).subscribe(res => {
            this.toastr.success('Reply Deleted Successfully!');
            this.commonservice.user_log({ message: 'User deleted reply successfully!' }).subscribe(res => { });
            arr.isDelete = true;
            this.allPost();
            this.spinner.hide();
          }, err => {
            this.spinner.hide();
            this.toastr.error(err.error.message);
          })
        }
      }
    });

  }

  async getPost() {
    return new Promise((pass, fail) => {
      this.commonservice.get_post().subscribe(res => {
        pass(res);
      }, err => {
        fail(err);
      });
    });
  }

  async onUploadMedia(files) {
    console.log('files=>', files);

    this.allImages = [];
    return new Promise((pass, fail) => {
      let cnt = 0;

      this.bucketName = 'mishow-profile-store';



      this.commonservice.getAllBuckets().subscribe(res => { });

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

        formData.append('file', files, files.name);

        if (localStorage.getItem('id_token') !== null) {
          this.token = localStorage.getItem('id_token')
          localStorage.setItem('token', this.token);
          localStorage.removeItem('id_token');
        }


        let url;
        url = this.bucketName + '?file-name=' + this.userDetails.sub + '/' + files.name;
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




  onChange(key, value) {
    if (key === 'displyName') {
      this.isDisplayName = true;
    }

    if (key === 'birthdate') {
      this.isBirthdate = true;
    }
    if (key === 'about') {
      this.isAbout = true;
    }

    if (key === 'location') {
      this.isLocation = true;
    }
    if (key === 'website') {
      this.isWebsite = true;
    }

    if (key === 'category') {

      this.isCategory = true;
    }
  }


  showSubscriber(key) {
    if (key === 'subscriber') {
      this.router.navigate(['/creator/subscribers/' + this.userId]);
    } else {
      this.router.navigate(['/creator/following/' + this.userId]);
    }
  }

  onEdit() {
    this.showSpinner = true;


    if (this.isDisplayName || this.isAbout || this.isWebsite || this.isLocation || this.isBirthdate || this.isCategory) {
      let obj = {};
      if (this.isDisplayName) {
        obj['display_name'] = this.editProfileForm.value.display_name;
      }
      if (this.isBirthdate) {
        obj['birthdate'] = this.editProfileForm.value.birthdate;
      }

      if (this.isCategory) {
        obj['category'] = this.updateCategory;
      }


      if (this.isProfileVideo) {
        obj['profile_video'] = this.updateProfileVideo;
      }
      if (this.isAbout) {
        obj['about'] = this.editProfileForm.value.about;
      }
      if (this.isLocation) {
        obj['location'] = this.editProfileForm.value.location;
      }

      if (this.isWebsite) {
        obj['website'] = this.editProfileForm.value.website;
      }



      if (this.displayName == undefined && this.birthdate == undefined) {
        this.commonservice.post_profile(obj).subscribe((res: any) => {
          this.toastr.success(res.message);
          this.showSpinner = true;
          this.commonservice.setupdatedUserDetail(obj);
          this.commonservice.user_log({ message: 'User update profile succesfully!' }).subscribe(res => { });
          this.modalRef.hide();
          this.modalRef = null;
        }, err => {
          this.showSpinner = true;
          this.toastr.error(err.error.message);
        });
      } else {

        this.commonservice.setupdatedUserDetail(obj);
        this.commonservice.edit_profile(obj).subscribe(res => {
          this.showSpinner = false;
          this.toastr.success('profile updated Successfully.');
          this.commonservice.setUser('Creator')
          this.commonservice.user_log({ message: 'User update profile succesfully!' }).subscribe(res => { });
          this.modalRef.hide();
          this.modalRef = null;
        }, err => {
          this.showSpinner = false;
          this.toastr.error(err.error.message);
        });
      }
    }

    if (this.isNewProfileImage) {
      this.showSpinner = true;

      this.onUploadMedia(this.files[0]).then((resFile: any) => {
        this.commonservice.edit_profile({ profile_picture: resFile }).subscribe(res => {
          this.showSpinner = false;
          this.toastr.success('profile updated Successfully.');
          this.onDownloadMedia(resFile).then(image => {
            this.commonservice.setupdatedUserDetail({ profile_picture: image });
            this.commonservice.setUser('Creator')
          });
          this.commonservice.user_log({ message: 'User update profile picture succesfully!' }).subscribe(res => { });
          this.showSpinner = false;
          this.modalRef.hide();
          this.modalRef = null;
        }, err => {
          this.showSpinner = false;
          this.toastr.error(err.error.message);
        });

      })
    }

    if (this.isNewTimelineImage) {
      this.showSpinner = true;
      this.onUploadMedia(this.filesTimelines[0]).then((resFile: any) => {
        this.commonservice.edit_profile({ timeline_picture: resFile }).subscribe(res => {
          this.showSpinner = false;
          this.toastr.success('profile updated Successfully.');
          this.onDownloadMedia(resFile).then(image => {
            this.commonservice.setupdatedUserDetail({ timeline_picture: image });
          });
          this.commonservice.user_log({ message: 'User update timeline image succesfully!' }).subscribe(res => { });
          this.showSpinner = false;
          this.modalRef.hide();
          this.modalRef = null;
        }, err => {
          this.showSpinner = false;
          this.toastr.error(err.error.message);
        });

      });
    }

    if (this.isNewProfileVideo) {
      this.showSpinner = true;

      this.onUploadMedia(this.filesVideos[0]).then((resFile: any) => {

        this.commonservice.edit_profile({ profile_video: resFile }).subscribe(res => {
          this.showSpinner = false;
          console.log('resFile video=>', resFile);
          this.onDownloadMedia(resFile).then(image => {
            this.commonservice.setupdatedUserDetail({ profile_video: image });
          });
          this.toastr.success('profile updated Successfully.');
          this.commonservice.user_log({ message: 'User update profile video succesfully!' }).subscribe(res => { });
          this.showSpinner = false;
          this.modalRef.hide();
          this.modalRef = null;
        }, err => {
          this.showSpinner = false;
          this.toastr.error(err.error.message);
        });

      })
    }

  }

  close() {
    this.filesVideos = [];
    this.filesTimelines = [];
    this.files = [];
    this.modalRef.hide();
    this.modalRef = null;
  }
  onClose() {
    this.isClose = true;
  }
  onCancel() {
    // this.confirmationService.confirm({
    //   message: 'Are you sure  you want to Cancel?',
    //   accept: () => {
    this.modalRef.hide();
    this.modalRef = null;
    //   }
    // });
  }
}
