import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/service/common.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  isLogin = false;
  isRegistration = false;
  isForgot = false;
  quickForm: FormGroup;
  RegisterForm: FormGroup;
  LoginForm: FormGroup;
  DetailRegistration_Subscriber: FormGroup;
  DetailRegistration_Creator: FormGroup;
  ForgotPasswordForm: FormGroup;
  submitted = false;
  loginSubmitted = false;
  modalRef: BsModalRef;
  account_type = 0;
  ImageURL: any;
  profileImage: File;
  ID: any;
  result = '';
  isCreator = false;
  isSubscriber = false;
  show_spinner = false;
  login_show_spinner = false;
  isType = false;
  userDetail: any;
  isCreatorSubmit = false;
  isSubscriberSubmit = false;
  usernameArray: any;
  isUsername = false;
  CategoryValues: any = [];
  categoryValue = 'Select Category';
  isEmail = false;
  emailMessage: any;
  isError = false;
  forgotSubmitted = false;
  errorMessage: any;
  cannotContainSpace = false;
  errorButton = false;
  quickSubmitted = false;
  quickSpinner = false;
  maxCharacter: any = [];
  categoryList: any = [{ label: 'Please Select category', value: '' }];
  isMax = false;
  minYear = moment(new Date(new Date().setFullYear(new Date().getFullYear() - 50))).format('YYYY');
  maxYear = moment(new Date(new Date().setFullYear(new Date().getFullYear() - 18))).format('YYYY');
  allImages: any = [];
  bucketName: any;
  token: any;
  constructor(
    private router: Router,
    private commonservice: CommonService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private http: HttpClient,
  ) {
    this.commonservice.getProfileID.subscribe((res: any) => {
      if (res) {

        if (res === 'false') {
          this.isRegistration = true;
          this.isLogin = false;
          this.isForgot = false;
          this.formInit();
        }

        if (res === 'true') {
          this.isLogin = true;
          this.formInitLogin();
          this.isRegistration = false;
          this.isForgot = false;
        }


      }
      else {
        this.isLogin = true;
        this.formInitLogin();
      }
    });
    this.quickInit();
  }

  ngOnInit() {
  }

  onClick(key) {
    if (key === 'login') {
      this.isLogin = true;
      this.formInitLogin();
      this.isRegistration = false;
      this.isForgot = false;
    } else if (key === 'forget') {
      this.isForgot = true;
      this.isLogin = false;
      this.formInitForgotPassword();
      this.isRegistration = false;
    } else {
      this.isRegistration = true;
      this.isLogin = false;
      this.isForgot = false;
      this.formInit();
    }
  }

  //Registration Startup form
  formInit = () => {
    this.RegisterForm = new FormGroup({
      user_name: new FormControl('', [
        Validators.required,
        this.noWhitespaceValidator,
        Validators.pattern(/^[a-zA-Z0-9._-]+$/)
      ]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      password: new FormControl('', [
        Validators.compose([
          Validators.required,
          this.noWhitespaceValidator,
          Validators.minLength(8),
          Validators.pattern(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30})/)])])
    });
  }

  quickInit = () => {
    this.quickForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      message: new FormControl('', [Validators.required])
    })
  }


  //function for creating form controls.
  formInitLogin = () => {
    this.LoginForm = new FormGroup({
      user_name: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      password: new FormControl('',
        [Validators.compose([
          Validators.required,
          this.noWhitespaceValidator,
          // Validators.minLength(8),
          Validators.pattern(/((?=.*\d)(?=.*[a-z]))/)])]),
    });
  }
  formInitForgotPassword = () => {
    this.ForgotPasswordForm = new FormGroup({
      'user_name': new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      'email': new FormControl('', [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])
    });
  }


  //Subscriber Registration form
  formInit_Subscriber = () => {
    this.DetailRegistration_Subscriber = new FormGroup({
      display_name: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      profile_image: new FormControl('', [Validators.required]),
      interested_category: new FormControl('', [Validators.required])
    });
  }

  //Creator Registration Form
  formInit_Creator = () => {
    this.DetailRegistration_Creator = new FormGroup({
      dispaly_name_creator: new FormControl('', [Validators.required, , this.noWhitespaceValidator]),
      profile_image_creator: new FormControl('', [Validators.required]),
      birth_date_creator: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required])
    });
  }

  // open popup for user guide
  openModal(template: TemplateRef<any>) {
    this.show_spinner = false;
    this.modalRef = this.modalService.show(template);
  }

  // Account Type
  type(value) {
    this.account_type = parseInt(value.target.value);
    if (this.account_type == 2 || this.account_type == 5) {
      this.isType = false;
    } else {
      this.isType = true;
    }
  }

  findSpace(event) {
    this.maxCharacter = event.target.value;
    this.usernameArray = event.target.value.split(' ');
    if (this.usernameArray.length === 1) {
      this.cannotContainSpace = false;
    } else {
      this.cannotContainSpace = true;
    }

    if (this.maxCharacter.length > 20) {
      this.isMax = true;
    } else {
      this.isMax = false;
    }

  }


  //function for submiting form
  onSubmitRegister(valid, temp) {
    this.submitted = true;
    if (valid && !this.isMax) {
      this.show_spinner = true;
      this.commonservice.signup(this.RegisterForm.value).subscribe(res => {
        if (res) {
          this.show_spinner = false;
          this.toastr.success(res['message']);
          // this.router.navigate(['/login']);
          this.isLogin = true;
          this.isRegistration = false;
          // this.openModal(temp);
        }
      }, err => {
        this.show_spinner = false;
        this.toastr.error(err.error.message);
      });
    } else {
      this.show_spinner = false;
    }
  }

  checkUser(id, value) {

    if (this.isRegistration) {
      if (id === 'username') {
        this.commonservice.validations(id, value.target.value).subscribe(res => {

          this.isError = false;
        }, err => {

          if (err.error['message'] === 'username not found') {
            this.isError = false;
          } else {
            this.isError = true;
            this.errorMessage = err.error['message'];
          }


        });
      }
      else if (id === 'email') {
        this.commonservice.validations(id, value.target.value).subscribe(res => {
          this.isEmail = false;
        }, err => {
          if (err.error['message'] === 'email not found') {
            this.isEmail = false;
          } else {
            this.isEmail = true;
            this.emailMessage = err.error['message'];
          }

        });
      }
    }
    else {
      if (id === 'username') {
        this.commonservice.validations(id, value.target.value).subscribe(res => {

          this.isError = false;
        }, err => {
          this.isError = true;
          this.errorMessage = err.error['message'];
        });
      }
      else if (id === 'email') {
        this.commonservice.validations(id, value.target.value).subscribe(res => {
          this.isEmail = false;
        }, err => {
          this.isEmail = true;
          this.emailMessage = err.error['message'];
        });
      }
    }

  }


  //function for checking there is no white space in input.
  noWhitespaceValidator(control: FormControl) {
    if (typeof (control.value || '') === 'string' || (control.value || '') instanceof String) {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { 'whitespace': true };
    }
  }

  //function for submiting form.
  onSubmit(valid, temp) {
    this.loginSubmitted = true;
    if (valid) {
      this.login_show_spinner = true;
      this.commonservice.login(this.LoginForm.value).subscribe((res: any) => {

        localStorage.setItem('id_token', res.id_token);
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('refresh_token', res.refresh_token);
        this.toastr.success('Successfully Login');


        this.commonservice.get_userDetail().subscribe((res: any) => {
          this.userDetail = res;

          if (this.userDetail !== '') {
            console.log('this.userDetail=>', this.userDetail);

            localStorage.setItem('username', this.userDetail.user_name);

            this.login_show_spinner = false;
            this.commonservice.user_log({ message: 'User logged in succesfully!' }).subscribe(res => { });
            setTimeout(() => {
              if (this.userDetail.account_type === 0) {
                this.openModal(temp);
                this.isType = false;
              } else if (this.userDetail.account_type === 2) {
                this.commonservice.setUser('Creator');
                this.router.navigate(['/creator']);
              } else if (this.userDetail.account_type === 5) {
                this.commonservice.setUser('Subscriber');
                this.router.navigate(['/subscriber']);
              }
            }, 1000);
          }
        });

      }, err => {
        this.login_show_spinner = false;

        this.toastr.error(err.error.message);
      });
    }

  }

  onCategoryChange(e) {
    this.CategoryValues = e;
    this.categoryValue = e;
  }
  //on submit form
  onForgotPassword(valid) {
    this.forgotSubmitted = true;
    if (valid) {
      this.show_spinner = true;
      this.commonservice.forgot_password(this.ForgotPasswordForm.value).subscribe(res => {
        if (res) {
          this.show_spinner = false;
          this.toastr.success(res['message']);
          this.router.navigate(['/']);
        }
      }, err => {
        this.show_spinner = false;
        this.toastr.error(err.error.message);
      })
    }
    else {

    }
  }

  // on pop up submit
  onGuideSubmit(temp2) {
    this.commonservice.get_all_category().subscribe(res => {
      res.forEach(e => {
        if (e.category_name !== '') {
          this.categoryList.push({ label: e.category_name, value: e.category_name });
        }
      })

    })
    if (this.account_type === 2 || this.account_type === 5) {
      this.isType = false;
    } else {
      this.isType = true;
    }
    if (!this.isType) {
      this.show_spinner = true;

      this.userDetail = this.commonservice.getLoggedUserDetail();
      this.ID = this.userDetail.user_id;

      if (this.account_type === 2) {

        this.isCreator = true;
        this.isSubscriber = false;
        this.formInit_Creator();
      }
      else if (this.account_type === 5) {
        this.isSubscriber = true;
        this.isCreator = false;
        this.formInit_Subscriber();

      }
      this.commonservice.account_type(this.account_type).subscribe((res: any) => {
        this.commonservice.refreshToken(this.userDetail.username, { refresh_token: localStorage.getItem('refresh_token') }).subscribe((token: any) => {
          localStorage.removeItem('id_token');
          localStorage.removeItem('access_token');
          localStorage.setItem('id_token', token.id_token);
          localStorage.setItem('access_token', token.access_token);
        });
        this.toastr.success('Account type submited!');
        this.modalRef.hide();
        this.modalRef = null;
        this.openModal(temp2);
        this.show_spinner = false;
      }, err => {
        this.show_spinner = false;
        this.toastr.error(err.error.message);
      });
    }

  }

  async onUploadMedia(files) {
    console.log('files=>', files);

    this.allImages = [];
    return new Promise((pass, fail) => {
      let cnt = 0;

      this.bucketName = 'mishow-profile-store';



      this.commonservice.getAllBuckets().subscribe(res => { });

      this.commonservice.getPresignURL('upload', this.bucketName, this.userDetail.sub, files.name).subscribe((data: any) => {


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


        let url = this.bucketName + '?file-name=' + this.userDetail.sub + '/' + files.name;
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
      cnt++;




    })
  }



  //on Subscriber Registration Submit
  onSubscriberSubmit(valid) {
    this.show_spinner = true;
    this.isSubscriberSubmit = true;
    let objProfile;
    if (valid) {

      this.onUploadMedia(this.profileImage).then((res: any) => {

        objProfile = {
          // user_id: this.ID,
          display_name: this.DetailRegistration_Subscriber.value.display_name,
          profile_picture: res,
          interested_categories: this.CategoryValues,
        };
        this.commonservice.post_profile(objProfile).subscribe(res => {
          this.commonservice.setUser('Subscriber');
          this.show_spinner = false;
          this.toastr.success(res['message']);
          this.modalRef.hide();
          this.modalRef = null;
          if (this.account_type === 5) {
            this.router.navigate(['/subscriber']);
          }
        }, err => {
          this.show_spinner = false;
          this.toastr.error(err.error['message']);
        });
      }).catch(err => {
        this.toastr.error(err.error['message']);
      });
    } else {
      this.show_spinner = false;
    }
  }

  onFileChange(value) {
    this.profileImage = value.target.files[0];
  }

  //on Creator Registration Submit
  onCreatorSubmit(valid) {
    this.show_spinner = true;
    let objProfile;
    this.isCreatorSubmit = true;
    if (valid) {

      this.onUploadMedia(this.profileImage).then((res: any) => {

        objProfile = {
          // user_id: this.ID,
          display_name: this.DetailRegistration_Creator.value.dispaly_name_creator,
          profile_picture: res,
          category: this.CategoryValues,
          birthdate: moment(this.DetailRegistration_Creator.value.birth_date_creator).format('YYYY-MM-DD-hh:mm:ss'),
        };
        this.commonservice.post_profile(objProfile).subscribe(res => {
          this.commonservice.setUser('Creator');
          this.show_spinner = false;
          this.toastr.success(res['message']);
          this.modalRef.hide();
          this.modalRef = null;
          if (this.account_type === 2) {
            this.router.navigate(['/creator']);
          }
        }, err => {
          this.show_spinner = false;
          this.toastr.error(err.error['message']);
        });
      }).catch(err => {
        this.toastr.error(err.error['message']);
      });

    } else {
      this.show_spinner = false;

    }

  }

  onQuick(valid) {
    this.quickSubmitted = true;
    if (valid) {
      console.log('this.quickForm.value=>', this.quickForm.value);
      this.quickSpinner = true;
      let obj = {
        email: this.quickForm.value.email,
        message: this.quickForm.value.message
      }

      this.commonservice.quickQuestion(obj).subscribe((res: any) => {
        this.quickSpinner = false;
        this.toastr.success('Send message successfully!');
        this.quickForm.reset();
        this.quickSubmitted = false;
      }, err => {
        this.quickSpinner = false;
        this.toastr.error(err.error.message);
      });
    } else {
      this.quickSpinner = false;
    }

  }


}
