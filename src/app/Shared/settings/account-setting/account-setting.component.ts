import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ControlContainer, Validators } from '@angular/forms';
import { CommonService } from 'src/app/service/common.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.css']
})
export class AccountSettingComponent implements OnInit {
  accountSettingForm: FormGroup;
  passwordForm: FormGroup;
  submitted = false;
  showDisabledSpinner = false;
  userDetails: any;
  notValid = false;
  isValid = false;
  notMatch = false;
  pwdDisable = false;
  email1: any;
  showSpinner = false;
  showPasswordSpinner = false;
  passwordSubmit = false;
  isEmailChange = false;
  updateProfileImage: any = [];
  updateTimelineImage: any = [];
  updateProfileVideo: any = [];
  emailError: any = [];
  profileImage: any;
  timelineImage: any;
  profileVideo: any = [];
  displayName: any;
  birthdate: any;
  location: any;
  website: any;
  about: any;
  profile_url: any;
  site_language: any;
  Email: any;
  matchEmail: any;
  language: any;
  password: any;
  new_password: any;
  isNewProfileImage = false;
  isNewTimelineImage = false;
  isNewProfileVideo = false;
  isMoreProfileImage = false;

  isMoreProfileVideo = false;
  isDisplayName = false;
  isMoreTimelineImage = false;

  isDOB = false;
  isLocation = false;
  isWebsite = false;
  isAbout = false;
  isProfileUrl = false;
  isSiteLanguage = false;
  isEmail = false;

  isPassword = false;
  isNewPassword = false;
  isCategory = false;
  files: File[] = [];
  filesTimelines: File[] = [];
  filesVideos: File[] = [];
  isVideo = false;
  name: any;
  minYear = moment(new Date(new Date().setFullYear(new Date().getFullYear() - 50))).format('YYYY');
  maxYear = moment(new Date()).format('YYYY');
  isCreator = false;
  isSubscriber = false;
  languageList: any = [
    { label: 'English', value: 'english' },
    { label: 'Spanish', value: 'spanish' },
  ];
  category: any = [];
  categoryList = [
    { label: 'Please Select any', value: '' }
  ];
  allImages: any = [];
  bucketName: any;
  token: any;
  constructor(
    private commonservice: CommonService,
    private toastr: ToastrService,
    private confirmService: ConfirmationService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
  ) {
    this.spinner.show();

    this.commonservice.get_all_category().subscribe((res: any) => {
      res.forEach(e => {
        this.categoryList.push({ label: e.category_name, value: e.category_name });
      });
    });

    this.userDetails = this.commonservice.getLoggedUserDetail();
    this.commonservice.get_userDetail().subscribe((res: any) => {
      this.language = res.language;
      this.Email = res.email;
      this.matchEmail = res.email;
      if (res.account_type === 2) {
        this.isCreator = true;
      }
      else {
        this.isSubscriber = true;
      }
    });
    this.commonservice.get_profile().subscribe((res: any) => {

      this.name = res.display_name;
      this.displayName = res.display_name;

      this.onDownloadMedia(res.profile_picture).then(image => {
        this.profileImage = image;
      })
      this.profile_url = res.profile_url;

      if (res.timeline_picture !== '') {
        this.onDownloadMedia(res.timeline_picture).then(image => {
          this.timelineImage = image;
        })
      }

      if (res.birthdate) {

        this.birthdate = moment(res.birthdate, 'YYYY-MM-DD-kk:mm:ss').format('MM/DD/YYYY hh:mm');
      }
      this.location = res.location;
      this.about = res.about;
      this.website = res.website;
      this.onDownloadMedia(res.profile_video).then(image => {
        this.profileVideo = image;
      })

      if (this.isCreator) {
        this.category = res.category;
      } else {
        this.category = res.interested_categories;
      }

    });



    this.formInit();
    this.spinner.hide();
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

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }


  formInit = () => {
    this.accountSettingForm = new FormGroup({

      displayName: new FormControl(''),
      birthdate: new FormControl(''),
      location: new FormControl(''),
      website: new FormControl(''),
      about: new FormControl(''),
      profile_url: new FormControl('', [Validators.pattern(/^[a-zA-Z0-9._-]+$/)]),
      site_language: new FormControl(''),
      category: new FormControl(''),
      email: new FormControl('', [Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      password: new FormControl(''),
      new_password: new FormControl('', [Validators.compose([

        this.noWhitespaceValidator,
        Validators.minLength(8),
        Validators.pattern(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30})/)])]),
      confirm_password: new FormControl('')
    });
  }
  checkEmail(e) {
    if (this.Email !== e.target.value) {
      this.isEmailChange = true;
      this.commonservice.validations('email', e.target.value).subscribe(res => {
        this.notValid = false;
      }, err => {
        this.emailError = err.error['message'];
        this.notValid = true;
      });
    }

  }

  onSelect(e) {
    console.log('e=>', e);

  }
  // function for checking there is no white space in input.
  noWhitespaceValidator(control: FormControl) {
    if (typeof (control.value || '') === 'string' || (control.value || '') instanceof String) {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { 'whitespace': true };
    }
  }

  // onEmail(valid) {
  //   this.showSpinner = true;
  //   this.submitted = true;

  //   if (valid) {
  //     this.isValid = false;

  //     if (this.email1 !== this.accountSettingForm.value.email) {

  //       this.commonservice.change_email(this.accountSettingForm.value.email).subscribe(res => {
  //         this.showSpinner = false;
  //         this.toastr.success('Email updated successfully', 'Success!', { timeOut: 3000 });
  //         this.commonservice.user_log({ message: 'User updated email id succesfully!' }).subscribe(res => { });
  //       }, err => {
  //         this.showSpinner = false;
  //         this.toastr.error(err.error.message, 'Error!', { timeOut: 3000 });
  //       });
  //     }
  //   } else {
  //     this.showSpinner = false;
  //     this.isValid = true;
  //   }
  // }
  ngOnInit() {
  }
  checkPassword(e) {
    console.log('this.passwordForm.value.new_password=>', this.passwordForm.value.new_password);

    this.pwdDisable = true;
    if (e.target.value !== this.accountSettingForm.value.new_password) {
      this.notMatch = true;
    } else {
      this.notMatch = false;
    }
  }

  onChange(key) {
    if (key === 'displayName') {
      this.isDisplayName = true;
    }

    if (key === 'birthdate') {

      this.isDOB = true;
    }
    if (key === 'location') {
      this.isLocation = true;
    }
    if (key === 'website') {
      this.isWebsite = true;
    }

    if (key === 'about') {
      this.isAbout = true;
    }
    if (key === 'profile_url') {
      this.isProfileUrl = true;
    }
    if (key === 'language') {
      this.isSiteLanguage = true;
    }
    if (key === 'email') {
      this.isEmail = true;
    }
    if (key === 'password') {
      this.isPassword = true;
    }
    if (key === 'newPassword') {
      this.isNewPassword = true;
    }

    if (key === 'category') {
      this.isCategory = true;
    }
  }




  async onUploadMedia(files) {
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


        let url = this.bucketName + '?file-name=' + this.userDetails.sub + '/' + files.name;
        this.http.post(data.url.url, formData).subscribe(res => {

          localStorage.setItem('id_token', localStorage.getItem('token'));
          this.allImages.push(url);

          pass(this.allImages);


        }, err => {
          fail(err)
          localStorage.setItem('id_token', localStorage.getItem('token'));
        });

      }, err => {
        fail(err)
      });
      cnt++;




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

  onSubmit(valid) {

    this.submitted = true;
    if (this.isPassword && this.isNewPassword) {
      if (valid) {
        this.showSpinner = true;
        let obj = {
          access_token: localStorage.getItem('access_token'),
          password: this.accountSettingForm.value.password,
          new_password: this.accountSettingForm.value.new_password
        };
        this.commonservice.change_password(obj).subscribe(res => {
          this.showSpinner = false;
          this.commonservice.user_log({ message: 'User updated password succesfully!' }).subscribe(res => { });
          this.toastr.success('Password updated successfully');
          this.passwordForm.reset();
          this.submitted = false;
          this.isPassword = false;
          this.isNewPassword = false;
        }, err => {
          this.showSpinner = false;
          this.toastr.error(err.error.message);
        })
      } else {
        this.showPasswordSpinner = false;
      }
    }

    if (this.isEmail) {
      this.isValid = false;
      this.showSpinner = true;


      if (this.matchEmail !== this.accountSettingForm.value.email) {

        this.commonservice.change_email(this.accountSettingForm.value.email).subscribe(res => {
          this.showSpinner = false;
          this.toastr.success('Email updated successfully');
          this.commonservice.user_log({ message: 'User updated email id succesfully!' }).subscribe(res => { });
          this.isEmail = false;
        }, err => {
          this.showSpinner = false;
          this.toastr.error(err.error.message);
        });
      }
    }

    if (this.isSiteLanguage) {

      this.showSpinner = true;

      let obj = {
        "language": this.accountSettingForm.value.site_language
      }

      this.commonservice.update_userDetailes(obj).subscribe(res => {
        this.showSpinner = false;
        this.toastr.success('Site langugae updated updated successfully');
        this.commonservice.user_log({ message: 'User updated site language succesfully!' }).subscribe(res => { });
        this.isSiteLanguage = false;
      }, err => {
        this.showSpinner = false;
        this.toastr.error(err.error.message);
      });

    }

    if (this.isDisplayName || this.isDOB || this.isLocation || this.isAbout || this.isWebsite || this.isCategory) {
      this.showSpinner = true;
      let obj = {};
      if (this.isDisplayName) {
        obj['display_name'] = this.accountSettingForm.value.displayName;
      }
      if (this.isDOB) {
        obj['birthdate'] = moment(this.accountSettingForm.value.birthdate).format('YYYY-MM-DD-kk:mm:ss');
      }
      if (this.isAbout) {
        obj['about'] = this.accountSettingForm.value.about;
      }
      if (this.isLocation) {
        obj['location'] = this.accountSettingForm.value.location;
      }

      if (this.isWebsite) {
        obj['website'] = this.accountSettingForm.value.website;
      }

      if (this.isCreator) {
        obj['category'] = this.category;
      } else {
        obj['interested_categories'] = this.category;
      }

      if (this.name == undefined) {
        this.commonservice.setupdatedUserDetail(obj);
        this.commonservice.post_profile(obj).subscribe(res => {
          this.toastr.success('Profile added successfully.');
          this.showSpinner = false;
          this.commonservice.user_log({ message: 'User update profile succesfully!' }).subscribe(res => { });

          this.isDisplayName = false;
          this.isDOB = false;
          this.isLocation = false;
          this.isAbout = false;
          this.isWebsite = false;
          this.isCategory = false;
        }, err => {
          this.showSpinner = false;
          this.toastr.error(err.error.message);
        });
      } else {
        this.commonservice.edit_profile(obj).subscribe(res => {
          this.showSpinner = false;
          this.toastr.success('profile updated Successfully.');

          this.commonservice.user_log({ message: 'User update profile succesfully!' }).subscribe(res => { });
          this.isDisplayName = false;
          this.isDOB = false;
          this.isLocation = false;
          this.isAbout = false;
          this.isWebsite = false;
          this.isCategory = false;
        }, err => {
          this.showSpinner = false;
          this.toastr.error(err.error.message);
        });

      }
    }

    if (this.isNewProfileImage) {
      this.showSpinner = true;
      this.onUploadMedia(this.files[0]).then((resFile: any) => {

        if (this.name == undefined) {

          this.commonservice.post_profile({ profile_picture: resFile }).subscribe(res => {
            this.toastr.success('Profile added successfully.');
            this.showSpinner = false;
            this.commonservice.user_log({ message: 'User update profile succesfully!' }).subscribe(res => { });
            this.isNewProfileImage = false;
          }, err => {
            this.showSpinner = false;
            this.toastr.error(err.error.message);
          });
        } else {
          this.commonservice.edit_profile({ profile_picture: resFile }).subscribe(res => {
            this.showSpinner = false;
            this.toastr.success('profile updated Successfully.');

            this.commonservice.user_log({ message: 'User update profile picture succesfully!' }).subscribe(res => { });
            this.showSpinner = false;
            this.isNewProfileImage = false;
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
        this.commonservice.edit_profile({ timeline_picture: resFile }).subscribe(res => {
          this.showSpinner = false;
          this.toastr.success('profile updated Successfully.');
          this.isNewTimelineImage = false;
          this.commonservice.user_log({ message: 'User update timeline image succesfully!' }).subscribe(res => { });
          this.showSpinner = false;
        }, err => {
          this.showSpinner = false;
          this.toastr.error(err.error.message);
        });
      })
    }

    if (this.isNewProfileVideo) {
      this.showSpinner = true;
      this.onUploadMedia(this.filesVideos[0]).then((resFile: any) => {
        this.commonservice.edit_profile({ profile_video: resFile }).subscribe(res => {
          this.showSpinner = false;
          this.toastr.success('profile updated Successfully.');
          this.isNewProfileVideo = false;
          this.commonservice.user_log({ message: 'User update profile video succesfully!' }).subscribe(res => { });
          this.showSpinner = false;
        }, err => {
          this.showSpinner = false;
          this.toastr.error(err.error.message);
        });
      })
    }

    if (this.isProfileUrl) {

      this.showSpinner = true;
      let obj = {
        profile_url: this.accountSettingForm.value.profile_url
      };
      this.commonservice.edit_profile(obj).subscribe(res => {
        this.showSpinner = false;
        this.commonservice.user_log({ message: 'User updated profile_url succesfully!' }).subscribe(res => { });
        this.toastr.success('Profile_url updated successfully');
        this.isProfileUrl = false;
      }, err => {
        this.showSpinner = false;
        this.toastr.error(err.error.message);
      });

    }


  }

  disabledUser() {
    this.showDisabledSpinner = true;
    this.confirmService.confirm({
      message: 'Are you sure  you want to delete this item?',
      accept: () => {
        this.showDisabledSpinner = false;
        this.commonservice.disabled_user().subscribe(res => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('id_token');
          this.toastr.success('Password updated successfully');
          this.router.navigate(['/']);
          this.commonservice.user_log({ message: 'User deleted account succesfully!' }).subscribe(res => { });
        });
      }, reject: () => {
        this.showDisabledSpinner = false;
      }
    });

  }

}
