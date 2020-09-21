import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { CommonService } from 'src/app/service/common.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import * as jsPDF from 'jspdf';
import { NgxSpinnerService } from 'ngx-spinner';
import { resolveCname } from 'dns';
@Component({
  selector: 'app-partner-agreement',
  templateUrl: './partner-agreement.component.html',
  styleUrls: ['./partner-agreement.component.css']
})
export class PartnerAgreementComponent implements OnInit {
  IDwithUser: File[] = [];
  IDFront: File[] = [];
  IDBack: File[] = [];
  agreementForm: FormGroup;
  submitted = false;
  showSpinner = false;
  isUserProof = false;
  isIDFront = false;
  isIDBack = false;
  userIDLength = false;
  frontLength = false;
  backLength = false;
  isUserFile = false;
  isFrontFIle = false;
  isBackFile = false;
  maxPostCount = 0;
  maxPostCount1 = 0;
  maxPostCount2 = 0;
  PDF: any;
  loadStamp: any;
  agreeStamp: any;
  submitStamp: any;
  browser: any;
  IP: any;
  geoLocation: any;
  id1: any;
  id2: any;
  id3: any;
  legalName: any;
  street: any;
  city: any;
  state: any;
  zip: any;
  country: any;
  dob: any;
  language: any;
  adultcontent: any;
  twitter: any;
  instagram: any;
  youtube: any;
  proof1: any;
  proof2: any;
  proof3: any;
  telephone: any;
  isShowId1 = false;
  isShowId2 = false;
  isShowId3 = false;

  isName = false;
  isStreet = false;
  isCity = false;
  isState = false;
  isZip = false;
  isCountry = false;
  isTelephone = false;
  isDOB = false;
  isLanguage = false;
  isAdult = false;
  isTwitter = false;
  isInstagram = false;
  isYoutube = false;
  isID1 = false;
  isID2 = false;
  isID3 = false;
  isEdit = false;
  isAdd = false;
  checked = false;
  isCheck = false;
  isApproved = false;
  userDetails: any = [];
  showMessage = false;
  languages = [
    { label: 'Select any', value: '' },
    { label: 'English', value: 'english' },
    { label: 'Spanish', value: 'spanish' }
  ];
  allImages: any = [];
  bucketName: any;
  token: any;
  NotAllow = false;
  NotAllow1 = false;
  NotAllow2 = false;
  constructor(
    private confirmationService: ConfirmationService,
    private commonservice: CommonService,
    private http: HttpClient,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {
    this.userDetails = this.commonservice.getLoggedUserDetail();
    this.spinner.show();
    this.isAdd = true;
    this.loadStamp = moment(new Date()).format('MMMM Do YYYY, h:mm:ss a');
    this.formInit();
    this.http.get('http://api.ipify.org/?format=json').subscribe((res: any) => {
      this.IP = res.ip;
    });
    const userAgent = window.navigator.userAgent;

    const browsers = { safari: /safari/i, chrome: /chrome/i, firefox: /firefox/i, ie: /internet explorer/i };

    for (const key in browsers) {
      if (browsers[key].test(userAgent)) {
        this.browser = key;
      }
    }

    this.commonservice.getPosition().then(pos => {
      this.geoLocation = pos.lng + ',' + pos.lat;
    });

    this.commonservice.get_agreement().subscribe((res: any) => {
      this.spinner.show();
      if (res) {
        if (res.admin.decision === 'APPROVED') {
          this.showMessage = false;
          this.isEdit = true;
          this.isAdd = false;
          this.legalName = res.legal_name;
          this.street = res.address.street;
          this.city = res.address.city;
          this.state = res.address.state;
          this.zip = res.address.zip;
          this.country = res.address.country;
          this.telephone = res.phone;
          this.dob = moment(res.date_of_birth).format('MM/DD/YYYY');
          this.language = res.native_language;
          this.adultcontent = res.adult_content;
          this.twitter = res.social_media.twitter;
          this.instagram = res.social_media.instagram;
          this.youtube = res.social_media.youtube;

          this.checked = true;


          this.onDownloadMedia(res.id1).then(image => {
            this.proof1 = image;
          });

          this.onDownloadMedia(res.id2).then(image => {
            this.proof2 = image;
          });

          this.onDownloadMedia(res.id_with_person).then(image => {
            this.proof3 = image;
          });
          this.spinner.hide();



          this.isApproved = true;
        } else {
          this.showMessage = true;
          this.spinner.hide();

        }

      } else {
        this.isAdd = true;
      }
    }, err => {
      this.spinner.hide();
    });

  }
  click(key) {
    if (key == '1') {
      this.isShowId1 = true;
    }
    if (key == '2') {
      this.isShowId2 = true;
    }
    if (key == '3') {
      this.isShowId3 = true;
    }
  }

  onChange(key) {

    if (key == 'legalName') {
      this.isName = true;
    }

    if (key == 'street') {
      this.isStreet = true;
    }

    if (key == 'city') {
      this.isCity = true;
    }

    if (key == 'state') {
      this.isState = true;
    }

    if (key == 'zip') {
      this.isZip = true;
    }

    if (key == 'country') {
      this.isCountry = true;
    }

    if (key == 'telephone') {
      this.isTelephone = true;
    }

    if (key == 'dob') {
      this.isDOB = true;
    }

    if (key == 'language') {
      this.isLanguage = true;
    }

    if (key == 'adultContent') {
      this.isAdult = true;
    }

    if (key == 'twitter') {
      this.isTwitter = true;
    }

    if (key == 'instagram') {
      this.isInstagram = true;
    }

    if (key == 'youtube') {
      this.isYoutube = true;
    }
  }

  ngOnInit() {

  }


  formInit = () => {
    this.agreementForm = new FormGroup({
      legalName: new FormControl('', Validators.required),
      street: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      zipcode: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      telephone: new FormControl('',
        Validators.compose([Validators.required,
        Validators.pattern(/^[0][1-9]\d{9}$|^[1-9]\d{9}$/)
        ])),
      DOB: new FormControl('', Validators.required),
      language: new FormControl('', Validators.required),
      adultContent: new FormControl(''),
      twitter: new FormControl(''),
      instagram: new FormControl(''),
      youtube: new FormControl(''),
      terms: new FormControl('', Validators.required),
    });
  }

  onTerms(e) {
    if (e === true) {
      if (this.agreementForm.value.terms === false || this.agreementForm.value.terms === '') {
        this.isCheck = true;
      } else {
        this.isCheck = false;
        this.agreeStamp = moment(new Date()).format('MMMM Do YYYY, h:mm:ss a');
      }
    } else {
      this.isCheck = true;
    }

    // var doc = new jsPDF();

    // this.PDF = doc.text('Hello world!', 10, 10);
    // doc.save('a4.pdf');
  }

  onSelect(event) {

    const isImages = ['jpg', 'jpeg', 'png', 'webp'];
    const imgStr = isImages.join(',');
    if (imgStr.includes(event.addedFiles[0].type.split('/').pop()) === true) {
      this.NotAllow = false;
      this.isID1 = true;

      this.IDwithUser = event.addedFiles;
      this.isUserFile = true;
    } else {
      this.NotAllow = true;
      this.IDwithUser = [];
    }

    if (this.IDwithUser.length === 0) {
      this.isUserProof = true;
      this.isUserFile = false;
    } else {
      this.isUserProof = false;
    }
  }

  onRemove(event) {
    // this.confirmationService.confirm({
    //   message: 'Are you sure  you want to delete this item?',
    //   accept: () => {
    this.isUserFile = false;
    this.maxPostCount = 0;
    this.IDwithUser.splice(this.IDwithUser.indexOf(event), 1);
    //   }
    // });
  }

  onSelect1(event) {

    const isImages = ['jpg', 'jpeg', 'png', 'webp'];
    const imgStr = isImages.join(',');
    if (imgStr.includes(event.addedFiles[0].type.split('/').pop()) === true) {
      this.NotAllow1 = false;
      this.isID2 = true;

      this.IDFront = event.addedFiles;
      this.isFrontFIle = true;
    } else {
      this.NotAllow1 = true;
      this.IDFront = [];
    }


    if (this.IDFront.length === 0) {
      this.isIDFront = true;
      this.isFrontFIle = false;
    } else {
      this.isIDFront = false;
    }
  }

  onRemove1(event) {
    // this.confirmationService.confirm({
    //   message: 'Are you sure  you want to delete this item?',
    //   accept: () => {
    this.isFrontFIle = false;
    this.maxPostCount1 = 0;
    this.IDFront.splice(this.IDFront.indexOf(event), 1);
    //   }
    // });
  }

  onSelect2(event) {


    const isImages = ['jpg', 'jpeg', 'png', 'webp'];
    const imgStr = isImages.join(',');
    if (imgStr.includes(event.addedFiles[0].type.split('/').pop()) === true) {
      this.NotAllow2 = false;
      this.isID3 = true;

      this.IDBack = event.addedFiles;
      this.isBackFile = true;
    } else {
      this.NotAllow2 = true;
      this.IDBack = [];
    }


    if (this.IDBack.length === 0) {
      this.isIDBack = true;
      this.isBackFile = false;
    } else {
      this.isIDBack = false;
    }
  }

  onRemove2(event) {
    // this.confirmationService.confirm({
    //   message: 'Are you sure  you want to delete this item?',
    //   accept: () => {
    this.isBackFile = false;
    this.maxPostCount2 = 0;
    this.IDBack.splice(this.IDBack.indexOf(event), 1);
    //   }
    // });
  }

  async onUploadMedia(files) {
    this.allImages = [];
    return new Promise((pass, fail) => {
      this.bucketName = 'mishow-docs-store';

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
    console.log('files=>', files);
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
    if (this.isAdd) {
      if (this.IDwithUser.length === 0) {
        this.isUserProof = true;
      } else {
        this.isUserProof = false;
      }

      if (this.IDFront.length === 0) {
        this.isIDFront = true;
      } else {
        this.isIDFront = false;
      }

      if (this.IDBack.length === 0) {
        this.isIDBack = true;
      } else {
        this.isIDBack = false;
      }

      if (this.agreementForm.value.terms === false || this.agreementForm.value.terms === '') {
        this.isCheck = true;
      } else {
        this.isCheck = false;
      }

      if (valid) {
        this.showSpinner = true;
        this.submitStamp = moment(new Date()).format('MMMM Do YYYY, h:mm:ss a');
        this.onUploadMedia(this.IDwithUser[0]).then((img1: any) => {
          this.id3 = img1;
        }).then(res => {
          this.onUploadMedia(this.IDFront[0]).then((img2: any) => {
            this.id1 = img2;
          }).then(res => {
            this.onUploadMedia(this.IDBack[0]).then((img3: any) => {
              this.id2 = img3;
            }).catch(err => {
              this.toastr.error(err.error.message);
            }).then(res => {
              let obj = {
                legal_name: this.agreementForm.value.legalName,
                address: {
                  street: this.agreementForm.value.street,
                  city: this.agreementForm.value.city,
                  state: this.agreementForm.value.state,
                  zip: this.agreementForm.value.zipcode,
                  country: this.agreementForm.value.country
                },
                phone: this.agreementForm.value.telephone,
                date_of_birth: this.agreementForm.value.DOB,
                native_language: this.agreementForm.value.language,
                adult_content: this.agreementForm.value.adultContent ? this.agreementForm.value.adultContent : false,
                social_media: {
                  twitter: this.agreementForm.value.twitter ? this.agreementForm.value.twitter : '',
                  instagram: this.agreementForm.value.instagram ? this.agreementForm.value.instagram : '',
                  youtube: this.agreementForm.value.youtube ? this.agreementForm.value.youtube : '',
                },
                id1: this.id1,
                id2: this.id2,
                id_with_person: this.id3,
                // "id1_exp": "expiry date of doc1",
                // "id2_exp": "expiry date of doc2",
                agreement_timestamps: {
                  page_load: this.loadStamp,
                  agreement: this.agreeStamp,
                  submission: this.submitStamp,
                },
                user_data: {
                  ip: this.IP,
                  browser: this.browser,
                  geolocation: this.geoLocation
                }
              };
              this.commonservice.add_agreement(obj).subscribe(res => {
                this.showMessage = true;
                this.showSpinner = false;
                this.toastr.success('Agreement added successfully');
                this.commonservice.user_log({ message: 'User added partner agreement succesfully!' }).subscribe(res => { });
              }, err => {
                this.showSpinner = false;
                this.toastr.error(err.error.message);
              });
            });
          });
        });
      } else {
        this.showSpinner = false;
      }
    }

    if (this.isEdit) {
      this.showSpinner = true;
      if (this.isName || this.isStreet || this.isCity || this.isState || this.isAdult
        || this.isZip || this.isCountry || this.isTelephone || this.isDOB
        || this.isLanguage || this.isYoutube || this.isInstagram || this.isTwitter) {
        let obj = {
          address: {},
          social_media: {},
        };

        if (this.isName) {
          obj['legal_name'] = this.agreementForm.value.legalName;
        }
        if (this.isStreet) {
          obj.address['street'] = this.agreementForm.value.street;
        }
        if (this.isCity) {
          obj.address['city'] = this.agreementForm.value.city;
        }
        if (this.isState) {
          obj.address['state'] = this.agreementForm.value.state;
        }
        if (this.isZip) {
          obj.address['zip'] = this.agreementForm.value.zipcode;
        }
        if (this.isCountry) {
          obj.address['country'] = this.agreementForm.value.country;
        }
        if (this.isTelephone) {
          obj['phone'] = this.agreementForm.value.telephone;
        }
        if (this.isDOB) {
          obj['date_of_birth'] = this.agreementForm.value.DOB;
        }
        if (this.isLanguage) {
          obj['native_language'] = this.agreementForm.value.language;
        }
        if (this.isAdult) {
          obj['adult_content'] = this.agreementForm.value.adultContent;
        }
        if (this.isTwitter) {
          obj.social_media['twitter'] = this.agreementForm.value.twitter;
        }
        if (this.isInstagram) {
          obj.social_media['instagram'] = this.agreementForm.value.instagram;
        }
        if (this.isYoutube) {
          obj.social_media['youtube'] = this.agreementForm.value.youtube;
        }

        this.commonservice.edit_agreement(obj).subscribe(res => {
          this.showSpinner = false;
          this.toastr.success('Agreement updated successfully');
          this.commonservice.user_log({ message: 'User update partner agreement succesfully!' }).subscribe(res => { });
        }, err => {
          this.showSpinner = false;
          this.toastr.error(err.error.message);
        });
      }


      if (this.isID1 || this.isID2 || this.isID3) {
        if (this.isID1 && this.isID2 && this.isID3) {
          this.showSpinner = true;
          this.onUploadMedia(this.IDwithUser[0]).then((img1: any) => {
            this.id3 = img1;
          }).then(res => {
            this.onUploadMedia(this.IDFront[0]).then((img2: any) => {
              this.id1 = img2;
            }).then(res => {
              this.onUploadMedia(this.IDBack[0]).then((img3: any) => {
                this.id2 = img3;
              }).catch(err => {
                this.toastr.error(err.error.message);
              }).then(res => {
                let obj = {
                  id1: this.id1,
                  id2: this.id2,
                  id_with_person: this.id3,
                };
                this.commonservice.edit_agreement(obj).subscribe(res => {
                  this.showSpinner = false;
                  this.toastr.success('Agreement updated successfully');
                  this.commonservice.user_log({ message: 'User update partner agreement succesfully!' }).subscribe(res => { });
                }, err => {
                  this.showSpinner = false;
                  this.toastr.error(err.error.message);
                });
              });
            });
          });
        }
        else if (this.isID1 && this.isID2) {
          this.showSpinner = true;
          this.onUploadMedia(this.IDwithUser[0]).then((img1: any) => {
            this.id3 = img1;
          }).then(res => {
            this.onUploadMedia(this.IDFront[0]).then((img2: any) => {
              this.id1 = img2;
            }).catch(err => {
              this.toastr.error(err.error.message);
            }).then(res => {
              let obj = {
                id1: this.id1,
                id_with_person: this.id3,
              };
              this.commonservice.edit_agreement(obj).subscribe(res => {
                this.showSpinner = false;
                this.toastr.success('Agreement updated successfully');
                this.commonservice.user_log({ message: 'User update partner agreement succesfully!' }).subscribe(res => { });
              }, err => {
                this.showSpinner = false;
                this.toastr.error(err.error.message);
              });
            });
          });
        }
        else if (this.isID1 && this.isID3) {
          this.showSpinner = true;
          this.onUploadMedia(this.IDwithUser[0]).then((img1: any) => {
            this.id3 = img1;
          }).then(res => {
            this.onUploadMedia(this.IDBack[0]).then((img2: any) => {
              this.id2 = img2;
            }).catch(err => {
              this.toastr.error(err.error.message);
            }).then(res => {
              let obj = {
                id2: this.id2,
                id_with_person: this.id3,
              };
              this.commonservice.edit_agreement(obj).subscribe(res => {
                this.showSpinner = false;
                this.toastr.success('Agreement updated successfully');
                this.commonservice.user_log({ message: 'User update partner agreement succesfully!' }).subscribe(res => { });
              }, err => {
                this.showSpinner = false;
                this.toastr.error(err.error.message);
              });
            });
          });
        }
        else if (this.isID2 && this.isID3) {
          this.showSpinner = true;
          this.onUploadMedia(this.IDFront[0]).then((img1: any) => {
            this.id1 = img1;
          }).then(res => {
            this.onUploadMedia(this.IDBack[0]).then((img2: any) => {
              this.id2 = img2;
            }).catch(err => {
              this.toastr.error(err.error.message);
            }).then(res => {
              let obj = {
                id1: this.id1,
                id2: this.id2,
              };
              this.commonservice.edit_agreement(obj).subscribe(res => {
                this.showSpinner = false;
                this.toastr.success('Agreement updated successfully');
                this.commonservice.user_log({ message: 'User update partner agreement succesfully!' }).subscribe(res => { });
              }, err => {
                this.showSpinner = false;
                this.toastr.error(err.error.message);
              });
            });
          });
        }
        else if (this.isID1) {
          this.showSpinner = true;
          this.onUploadMedia(this.IDwithUser[0]).then((res: any) => {
            this.id3 = res.data.Location;
          }).then(res => {
            let obj = {
              id_with_person: this.id3,
            };
            this.commonservice.edit_agreement(obj).subscribe(res => {
              this.showSpinner = false;
              this.toastr.success('Agreement updated successfully');
              this.commonservice.user_log({ message: 'User update partner agreement succesfully!' }).subscribe(res => { });
            }, err => {
              this.showSpinner = false;
              this.toastr.error(err.error.message);
            });
          });
        }
        else if (this.isID2) {
          this.showSpinner = true;
          this.onUploadMedia(this.IDFront[0]).then((res: any) => {
            this.id1 = res;
          }).then(res => {
            let obj = {
              id1: this.id1,
            };
            this.commonservice.edit_agreement(obj).subscribe(res => {
              this.showSpinner = false;
              this.toastr.success('Agreement updated successfully');
              this.commonservice.user_log({ message: 'User update partner agreement succesfully!' }).subscribe(res => { });
            }, err => {
              this.showSpinner = false;
              this.toastr.error(err.error.message);
            });
          });
        }
        else if (this.isID3) {
          this.showSpinner = true;
          this.onUploadMedia(this.IDBack[0]).then((res: any) => {
            this.id2 = res;
          }).then(res => {
            let obj = {
              id2: this.id2,
            };
            this.commonservice.edit_agreement(obj).subscribe(res => {
              this.showSpinner = false;
              this.toastr.success('Agreement updated successfully');
              this.commonservice.user_log({ message: 'User update partner agreement succesfully!' }).subscribe(res => { });
            }, err => {
              this.showSpinner = false;
              this.toastr.error(err.error.message);
            });
          });
        }
      }

    }

  }

}
