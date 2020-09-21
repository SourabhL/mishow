import { Component, OnInit, TemplateRef } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';
import { FormGroup, FormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-subscriber-profile',
  templateUrl: './subscriber-profile.component.html',
  styleUrls: ['./subscriber-profile.component.css']
})
export class SubscriberProfileComponent implements OnInit {
  editProfileForm: FormGroup;

  displayName: any;
  birthdate: any;
  profilePicture: any;
  profileVideo: string;
  about: any;
  userName: any;
  location: any;
  isTimeline = false;
  timelineImage: any = [];
  updateDisplayName: any;
  updateBirthdate: any;
  updateProfilePicture: any;
  updateProfileVideo: any;
  updateAbout: any;
  updateLocation: any;

  isDisplayName = false;
  isBirthdate = false;
  isProfilePicture = false;
  isProfileVideo = false;
  isAbout = false;
  isLocation = false;
  modalRef: BsModalRef;
  profileImage: any;
  showSpinner = false;
  userDetails: any = [];
  isNewTimelineImage = false;
  isMoreTimelineImage = false;
  isNewProfileImage = false;
  isMoreProfileImage = false;
  updateTimelineImage: any = [];
  updateCategory: any = [];
  isCategory = false
  updateProfileImage: any = [];
  files: File[] = [];
  filesTimelines: File[] = [];
  totalFollowing = 0;
  userId: any;
  categoryList = [
    { label: 'Please Select any', value: '' }
  ];
  allImages: any = [];
  bucketName: any;
  token: any;
  minYear = moment(new Date(new Date().setFullYear(new Date().getFullYear() - 50))).format('YYYY');
  maxYear = moment(new Date()).format('YYYY');
  constructor(
    private commonservice: CommonService,
    private modalService: BsModalService,
    private spinnerService: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private http: HttpClient,
  ) {
    this.spinnerService.show();

    this.userDetails = this.commonservice.getLoggedUserDetail();
    this.getDetail().then((res: any) => {
      this.displayName = res.display_name;
      this.onDownloadMedia(res.profile_picture).then(res => {
        this.profilePicture = res;
      })
      this.userName = this.userDetails.username;
      this.birthdate = res.birthdate;
      this.location = res.location;
      this.about = res.about;
      this.userId = res.user_id;
      this.totalFollowing = res.subscription_list.length;
      if (res.timeline_picture) {
        this.isTimeline = true;
        this.onDownloadMedia(res.timeline_picture).then(res => {
          this.timelineImage = res;
        })
      }
      this.spinnerService.hide();
    }).catch(err => {
      this.spinnerService.hide();
      this.toastr.error(err);
    });



    this.commonservice.getupdatedUserDetail.subscribe((res: any) => {
      if (res.display_name) {
        this.displayName = res.display_name;
      }
      this.userName = this.userDetails.username;
      if (res.birthdate) {
        this.birthdate = res.birthdate;
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

      if (res.timeline_picture) {
        this.isTimeline = true;
        this.timelineImage = res.timeline_picture;
      }

    });
  }
  async getDetail() {
    return new Promise((pass, fail) => {
      this.commonservice.get_profile().subscribe((res: any) => {
        if (res) {
          pass(res);
        }
      }, err => {
        fail(err);
      });
    });
  }

  showSubscriber() {
    this.router.navigate(['/creator/following/' + this.userId]);
  }

  onSelectImage(event) {
    if (event.addedFiles.length === 1) {
      this.isMoreProfileImage = false;
      this.isNewProfileImage = true;
      this.files = event.addedFiles;
    } else {
      this.isMoreProfileImage = true;
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


  onSelectTimeline(event) {
    if (event.addedFiles.length === 1) {
      this.isMoreTimelineImage = false;
      this.isNewTimelineImage = true;
      this.filesTimelines = event.addedFiles;
    } else {
      this.isMoreTimelineImage = true;
    }
  }

  ngOnInit() {

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

    if (key === 'category') {
      this.isCategory = true;
    }
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
    // this.formInit();
    this.getDetail().then((res: any) => {
      this.updateDisplayName = res.display_name;
      this.updateBirthdate = res.birthdate;
      this.updateLocation = res.location;
      this.updateAbout = res.about;
      this.updateProfilePicture = res.profile_picture;
      this.updateProfileVideo = res.profile_video;
      this.updateCategory = res.interested_categories;
      if (res.birthdate !== null) {

        this.updateBirthdate = moment(res.birthdate, 'YYYY-MM-DD-kk:mm:ss').format('MM/DD/YYYY hh:mm');
      }
      this.spinnerService.hide();

    }, err => {
      this.toastr.error(err.error.message);
      this.spinnerService.hide();
    });
  }

  onFileChange(e, value) {
    this.isProfilePicture = true;
    this.profileImage = value.target.files[0];
  }


  onEdit() {
    this.showSpinner = true;
    if (this.isLocation || this.isBirthdate || this.isDisplayName || this.isCategory) {
      let obj = {};
      if (this.isDisplayName) {
        obj['display_name'] = this.updateDisplayName;
      }
      if (this.isBirthdate) {
        obj['birthdate'] = this.updateBirthdate;
      }
      if (this.isAbout) {
        obj['about'] = this.updateAbout;
      }
      if (this.isLocation) {
        obj['location'] = this.updateLocation;
      }

      if (this.isCategory) {
        obj['interested_categories'] = this.updateCategory;
      }

      if (this.displayName == undefined && this.birthdate == undefined) {
        this.commonservice.setupdatedUserDetail(obj);
        this.commonservice.post_profile(obj).subscribe(res => {
          this.toastr.success(res['message']);
          this.commonservice.user_log({ message: 'User update profile succesfully!' }).subscribe(res => { });
          this.showSpinner = true;
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
        this.updateProfileImage = resFile;
      }).then(res => {
        if (this.updateProfileImage) {
          this.commonservice.edit_profile({ profile_picture: this.updateProfileImage }).subscribe(res => {
            this.onDownloadMedia(this.updateProfileImage).then(res => {
              this.commonservice.setupdatedUserDetail({ profile_picture: res });
            });
            this.showSpinner = false;
            this.toastr.success('profile updated Successfully.');

            this.commonservice.user_log({ message: 'User update profile picture succesfully!' }).subscribe(res => { });
            this.showSpinner = false;
            this.modalRef.hide();
            this.modalRef = null;
          }, err => {
            this.showSpinner = false;
            this.toastr.error(err.error.message);
          });
        }
      });
    }

    if (this.isNewTimelineImage) {
      this.showSpinner = true;
      this.onUploadMedia(this.filesTimelines[0]).then((resFile: any) => {
        this.updateTimelineImage = resFile;
      }).then(res => {
        if (this.updateProfileImage) {
          this.commonservice.edit_profile({ timeline_picture: this.updateTimelineImage }).subscribe(res => {
            this.onDownloadMedia(this.updateTimelineImage).then(res => {
              this.commonservice.setupdatedUserDetail({ timeline_picture: res });
            });
            this.showSpinner = false;
            this.toastr.success('profile updated Successfully.');

            this.commonservice.user_log({ message: 'User update timeline image succesfully!' }).subscribe(res => { });
            this.showSpinner = false;
            this.modalRef.hide();
            this.modalRef = null;
          }, err => {
            this.showSpinner = false;
            this.toastr.error(err.error.message);
          });
        }
      });
    }





  }
}
