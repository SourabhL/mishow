import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { CommonService } from 'src/app/service/common.service';
import { ToastrService } from 'ngx-toastr';

import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-release-agreement',
  templateUrl: './release-agreement.component.html',
  styleUrls: ['./release-agreement.component.css']
})
export class ReleaseAgreementComponent implements OnInit {
  IDwithUser: File[] = [];
  IDFront: File[] = [];
  IDBack: File[] = [];

  releaseForm: FormGroup;

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

  isName = false;
  isStreet = false;
  isCity = false;
  isState = false;
  isZip = false;
  isCountry = false;
  isTelephone = false;
  isDOB = false;
  isEmail = false;
  isAdult = false;

  isID1 = false;
  isID2 = false;
  isID3 = false;
  isEdit = false;
  isAdd = false;

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
  email: any;
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
  checked = false;
  isCheck = false;
  isApproved = false;
  userDetails: any = [];
  allImages: any = [];
  bucketName: any;
  token: any;
  NotAllow = false;
  NotAllow1 = false;
  NotAllow2 = false;
  constructor(
    private confirmationService: ConfirmationService,
    private commonservice: CommonService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private http: HttpClient) {
    this.userDetails = this.commonservice.getLoggedUserDetail();
    this.isAdd = true;
    this.formInit();

    this.commonservice.get_release_agreement().subscribe((res: any) => {
      this.spinner.show();
      if (res) {
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
        this.email = res['e-mail'];
        this.adultcontent = res.adult_content;

        this.proof1 = res.id1;
        this.proof2 = res.id2;
        this.proof3 = res.id_with_person;

        this.onDownloadMedia(res.id1).then(image => {
          this.proof1 = image;
        });

        this.onDownloadMedia(res.id2).then(image => {
          this.proof2 = image;
        });

        this.onDownloadMedia(res.id_with_person).then(image => {
          this.proof3 = image;
        });

        this.checked = res.terms_acceptance;

        if (res.admin.decision === 'APPROVED') {
          this.isApproved = true;
        }
        this.spinner.hide();
      } else {
        this.isAdd = true;
      }
    });
  }

  ngOnInit() {
  }


  formInit = () => {
    this.releaseForm = new FormGroup({
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
      email: new FormControl('', [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      adultContent: new FormControl(''),
      terms: new FormControl('', Validators.required),
    });
  }

  onSelect(event) {
    const isImages = ['jpg', 'jpeg', 'png', 'webp'];
    const imgStr = isImages.join(',');
    if (imgStr.includes(event.addedFiles[0].type.split('/').pop()) === true) {
      this.NotAllow = false;
      this.IDwithUser = event.addedFiles;
      this.isID1 = true;
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
      this.isID2 = true;
      this.NotAllow1 = false;
      this.IDFront = event.addedFiles;
      this.isFrontFIle = true;
    } else {
      this.NotAllow1 = true;
      this.IDFront = [];
    }

    // if (this.maxPostCount1 <= 1) {

    // } else {
    //   this.maxPostCount1 = 0;
    //   this.frontLength = true;
    // }


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
      this.backLength = false;
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

  onTerms(e) {
    if (e === true) {
      if (this.releaseForm.value.terms === false || this.releaseForm.value.terms === '') {
        this.isCheck = true;
      } else {
        this.isCheck = false;
      }
    } else {
      this.isCheck = true;
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

    if (key == 'email') {
      this.isEmail = true;
    }

    if (key == 'adultContent') {
      this.isAdult = true;
    }


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

      if (this.releaseForm.value.terms === false || this.releaseForm.value.terms === '') {
        this.isCheck = true;
      } else {
        this.isCheck = false;
      }
      if (!(this.isUserProof) && !(this.isIDFront) && !(this.isIDBack) && !(this.isCheck)) {
        if (valid) {
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
                  legal_name: this.releaseForm.value.legalName,
                  address: {
                    street: this.releaseForm.value.street,
                    city: this.releaseForm.value.city,
                    state: this.releaseForm.value.state,
                    zip: this.releaseForm.value.zipcode,
                    country: this.releaseForm.value.country
                  },
                  phone: this.releaseForm.value.telephone,
                  date_of_birth: this.releaseForm.value.DOB,
                  "e-mail": this.releaseForm.value.email,
                  terms_acceptance: true,
                  adult_content: this.releaseForm.value.adultContent ? this.releaseForm.value.adultContent : false,
                  id1: this.id1,
                  id2: this.id2,
                  id_with_person: this.id3,
                  // "id1_exp": "expiry date of doc1",
                  // "id2_exp": "expiry date of doc2",

                };
                this.commonservice.add_release_agreement(obj).subscribe(res => {
                  this.showSpinner = false;
                  this.toastr.success('Agrrement added successfully');
                  this.commonservice.user_log({ message: 'User add release agreement succesfully!' }).subscribe(res => { });
                }, err => {
                  this.showSpinner = false;
                  this.toastr.error(err.error.message);
                });
              });
            });
          });

        }
      } else {
        this.showSpinner = false;
      }
    }

    if (this.isEdit) {
      this.showSpinner = true;
      if (this.isName || this.isStreet || this.isCity || this.isState || this.isAdult
        || this.isZip || this.isCountry || this.isTelephone || this.isDOB || this.isEmail
      ) {
        let obj = {
          address: {},
          social_media: {},
        };


        if (this.isName) {
          obj['legal_name'] = this.releaseForm.value.legalName;
        }
        if (this.isStreet) {
          obj.address['street'] = this.releaseForm.value.street;
        }
        if (this.isCity) {
          obj.address['city'] = this.releaseForm.value.city;
        }
        if (this.isState) {
          obj.address['state'] = this.releaseForm.value.state;
        }
        if (this.isZip) {
          obj.address['zip'] = this.releaseForm.value.zipcode;
        }
        if (this.isCountry) {
          obj.address['country'] = this.releaseForm.value.country;
        }
        if (this.isTelephone) {
          obj['phone'] = this.releaseForm.value.telephone;
        }
        if (this.isDOB) {
          obj['date_of_birth'] = this.releaseForm.value.DOB;
        }
        if (this.isEmail) {
          obj['e-mail'] = this.releaseForm.value.email;
        }
        if (this.isAdult) {
          obj['adult_content'] = this.releaseForm.value.adultContent;
        }


        this.commonservice.edit_release_agreement(obj).subscribe(res => {
          this.showSpinner = false;
          this.toastr.success('Agreement updated successfully');
          this.commonservice.user_log({ message: 'User update release agreement succesfully!' }).subscribe(res => { });
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
                this.commonservice.edit_release_agreement(obj).subscribe(res => {
                  this.showSpinner = false;
                  this.toastr.success('Agreement updated successfully');
                  this.commonservice.user_log({ message: 'User update release agreement succesfully!' }).subscribe(res => { });
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
              this.commonservice.edit_release_agreement(obj).subscribe(res => {
                this.showSpinner = false;
                this.toastr.success('Agreement updated successfully');
                this.commonservice.user_log({ message: 'User update release agreement succesfully!' }).subscribe(res => { });
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
              this.commonservice.edit_release_agreement(obj).subscribe(res => {
                this.showSpinner = false;
                this.toastr.success('Agreement updated successfully');
                this.commonservice.user_log({ message: 'User update release agreement succesfully!' }).subscribe(res => { });
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
              this.commonservice.edit_release_agreement(obj).subscribe(res => {
                this.showSpinner = false;
                this.toastr.success('Agreement updated successfully');
                this.commonservice.user_log({ message: 'User update release agreement succesfully!' }).subscribe(res => { });
              }, err => {
                this.showSpinner = false;
                this.toastr.error(err.error.message);
              });
            });
          });
        }
        else if (this.isID1) {
          this.showSpinner = true;
          this.onUploadMedia(this.IDwithUser[0]).then((img1: any) => {
            this.id3 = img1;
          }).then(res => {
            let obj = {
              id_with_person: this.id3,
            };
            this.commonservice.edit_release_agreement(obj).subscribe(res => {
              this.showSpinner = false;
              this.toastr.success('Agreement updated successfully');
              this.commonservice.user_log({ message: 'User update release agreement succesfully!' }).subscribe(res => { });
            }, err => {
              this.showSpinner = false;
              this.toastr.error(err.error.message);
            });
          });
        }
        else if (this.isID2) {
          this.showSpinner = true;
          this.onUploadMedia(this.IDFront[0]).then((img1: any) => {
            this.id1 = img1;
          }).then(res => {
            let obj = {
              id1: this.id1,
            };
            this.commonservice.edit_release_agreement(obj).subscribe(res => {
              this.showSpinner = false;
              this.toastr.success('Agreement updated successfully');
              this.commonservice.user_log({ message: 'User update release agreement succesfully!' }).subscribe(res => { });
            }, err => {
              this.showSpinner = false;
              this.toastr.error(err.error.message);
            });
          });
        }
        else if (this.isID3) {
          this.showSpinner = true;
          this.onUploadMedia(this.IDBack[0]).then((img1: any) => {
            this.id2 = img1;
          }).then(res => {
            let obj = {
              id2: this.id2,
            };
            this.commonservice.edit_release_agreement(obj).subscribe(res => {
              this.showSpinner = false;
              this.toastr.success('Agreement updates successfully');
              this.commonservice.user_log({ message: 'User update release agreement succesfully!' }).subscribe(res => { });
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
