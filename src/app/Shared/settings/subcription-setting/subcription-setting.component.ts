import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/service/common.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-subcription-setting',
  templateUrl: './subcription-setting.component.html',
  styleUrls: ['./subcription-setting.component.css']
})
export class SubcriptionSettingComponent implements OnInit {
  subscriptionForm: FormGroup;
  tier_info: any = [];
  finalTier: any = [];

  editInfo: any = [];
  showSpinner = false;
  tierData: any = [];
  submitted = false;
  userId: any
  isAdd = false;
  isEdit = false;
  isDescrition = false;
  isName = false;
  isEnable = false;
  isPrice = false;
  tierId: any;
  description: any = []
  name: any = [];
  price: any = [];
  enable: any = [];
  isApproved = false;
  isfree = false;
  enableFree: any = [];
  freetierdetail: any = [];
  editTier: any = [];
  isaddTier = false;
  isButtonClicked = false;
  allowAdd = false;
  disbaleNow = false;
  constructor(
    private commonservice: CommonService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService
  ) {
    this.spinner.show();
    this.formInit();
    this.getDetail().then((res: any) => {
      if (res.tiers.length === 1) {
        this.isAdd = true;
        this.addTier(this.tierData.length);

        res.tiers.forEach(e => {
          if (e.tier_price > 0) {
            this.tierData.push(e);
          }
        });

        this.freetierdetail = res.tiers;
      } else {
        this.isEdit = true;

        this.userId = res.user_id;
        res.tiers.forEach(e => {
          this.tierId = e.tier_id;
          if (e.tier_price > 0) {
            this.tierData.push(e);
          }
        });

        this.freetierdetail = res.tiers;
        this.updateTier(this.tierData);

      }

      if (res.tiers.length >= 4) {
        this.allowAdd = false;
      } else if (res.tiers.length < 4) {
        this.allowAdd = true;
      }

      this.commonservice.get_agreement().subscribe((res: any) => {
        if (res.admin.decision === 'APPROVED') {
          this.isApproved = true;
        }
      }, err => {
        this.isApproved = false;
      })


    }, err => {
      this.spinner.hide();
    });

  }

  async getDetail() {
    return new Promise((pass, fail) => {
      this.commonservice.get_subscription().subscribe((res: any) => {
        pass(res);
      }, err => {
        fail(fail);
      });
    });
  }


  formInit = () => {
    this.subscriptionForm = new FormGroup({
      tierArray: this.fb.array([]),
      freeTier: new FormControl('')
    });
  }
  ngOnInit() {
  }

  get tierArray() {
    return this.subscriptionForm.get('tierArray') as FormArray;
  }

  addTier(data_index = null) {
    if (this.tierData.length <= 2) {
      this.allowAdd = true;
      this.isaddTier = true;
      this.spinner.show();
      let index = 0;

      if (data_index == null) {

        if (this.tierData && this.tierData.length > 0) {

          index = this.tierData.length;
        } else {

          this.tierData = [];
        }
      } else {

        if (this.tierData && this.tierData.length > 0) {

          index = this.tierData.length;
        } else {

          index = data_index;
        }
      }
      const newTier = {
        tier_description: '',
        tier_enabled: '',
        tier_name: '',
        tier_price: '',
      };

      this.tierArray.setControl(index, this.fb.group({
        tier_name: ['', [Validators.required]],
        tier_enabled: [''],
        tier_description: ['', Validators.required],
        tier_price: ['', [Validators.required]],
      }));
      setTimeout(() => {
        this.tierData.push(newTier);
        this.updateValidation();
        this.spinner.hide();
      }, 300);
    } else {
      this.allowAdd = false;
      this.toastr.error('Maximum amount of tiers reached.');
    }

  }

  updateTier(data: any) {
    console.log('this.tier Data=>', data);
    this.tierData = data;
    const _array = [];
    this.tierData.forEach((e, index) => {
      const newTier = {
        tier_name: e.tier_name,
        tier_enabled: e.tier_enabled,
        tier_description: e.tier_description,
        tier_price: e.tier_price,
        tier_id: e.tier_id
      };
      this.tierArray.setControl(index, this.fb.group({
        tier_name: ['', [Validators.required]],
        tier_enabled: [''],
        tier_description: ['', Validators.required],
        tier_price: ['', [Validators.required]],
      }));
      _array.push(newTier);
    });
    this.tierData = _array;
    this.spinner.hide();
  }



  //function for checking there is no white space in input.
  noWhitespaceValidator(control: FormControl) {
    if (typeof (control.value || '') === 'string' || (control.value || '') instanceof String) {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { whitespace: true };
    }
  }


  // Update form validation
  updateValidation() {
    this.subscriptionForm.updateValueAndValidity();
  }


  onChange(arr, key) {
    this.tier_info.push(arr);
    if (key === 'description') {
      this.isDescrition = true;
      this.description.push({
        tier_id: arr.tier_id,
        tier_description: arr.tier_description
      });
    }

    if (key === 'enable') {
      this.isEnable = true;
      this.enable.push({
        tier_id: arr.tier_id,
        tier_enabled: arr.tier_enabled
      });
    }

    if (key === 'name') {
      this.isName = true;
      this.name.push({
        tier_id: arr.tier_id,
        tier_name: arr.tier_name
      });
    }

    if (key === 'price') {
      this.isPrice = true;
      this.price.push({
        tier_id: arr.tier_id,
        tier_price: arr.tier_price
      });
    }
  }

  onFreeChange(arr) {
    console.log('arr=>', arr);

    this.isfree = true;
    this.enableFree.push({
      tier_id: arr.tier_id,
      tier_enabled: arr.tier_enabled
    });

  }

  onSubmit(valid) {
    this.isButtonClicked = true;
    this.submitted = true;

    if (this.isAdd) {
      this.spinner.show();
      this.tier_info = [];
      if (valid) {
        this.showSpinner = true;
        let obj = {
          opt: 'add',
          tier_info: ''
        }
        let i = 1;

        this.subscriptionForm.value.tierArray.forEach(e => {
          let tierEnable;
          if (e.tier_enabled == '') {
            tierEnable = false;
          } else {
            tierEnable = true;
          }


          this.tier_info.push({

            tier_name: e.tier_name,
            tier_description: e.tier_description,
            tier_price: e.tier_price,
            tier_enabled: tierEnable,
            tier_id: i,
            creator_id: this.userId
          });
          i++;
        });

        obj.tier_info = this.tier_info;

        this.commonservice.update_subscription(obj).subscribe((res: any) => {
          // this.tier_info = [];
          this.subscriptionForm.controls['tierArray'].reset();
          this.isEdit = true;


          this.tier_info.forEach((e, index) => {
            delete this.tierData[index];
            this.tierArray.removeAt(index);

            const array = [];
            for (let i = 0; i < this.tierData.length; i++) {
              if (this.tierData[i] !== undefined) {
                array.push(this.tierData[i]);
              }
            }
            this.tierData = array;
          });


          this.userId = res.user_id;
          res.tiers.forEach((e) => {



            this.tierId = e.tier_id;
            if (e.tier_price > 0) {
              this.tierData.push(e);
            }
          });

          this.freetierdetail = res.tiers;
          this.updateTier(this.tierData);

          if (res.tiers.length >= 3) {
            this.allowAdd = false;
          } else if (res.tiers.length < 3) {
            this.allowAdd = true;
          }
          this.isAdd = false;
          this.submitted = false;
          this.showSpinner = false;
          this.toastr.success('Subscriptions added successfully!');
          this.commonservice.user_log({ message: 'User added subscriptions succesfully!' }).subscribe(res => { });
          this.spinner.hide();
        }, err => {
          this.spinner.hide();
          this.showSpinner = false;
          this.toastr.error(err.error.message);
        });
      }


    }

    if (this.isEdit && (this.price.length > 0 || this.name.length > 0 || this.enable.length > 0 || this.description.length > 0)) {

      this.spinner.show();
      this.showSpinner = true;
      let obj = {
        opt: 'update',
        tier_info: ''
      }

      this.tier_info.forEach(e => {
        if (e.tier_id) {

          if (this.finalTier.length == 0) {

            this.finalTier.push(e);

          } else {

            let t1 = _.find(this.finalTier, { 'tier_id': e.tier_id });
            if (t1 === undefined) {
              this.finalTier.push(e);
            }
          }
        }

        // if(this.finalTier)
      });
      if (this.description.length > 0) {
        this.description.forEach(e => {
          if (e.tier_id !== undefined) {
            this.tier_info.push(e);
          }
        });
      }
      if (this.enable.length > 0) {
        this.enable.forEach(e => {
          if (e.tier_id !== undefined) {

            this.tier_info.push(e);
          }
        });
      }
      if (this.name.length > 0) {
        this.name.forEach(e => {
          if (e.tier_id !== undefined) {

            this.tier_info.push(e);
          }
        });
      }
      if (this.price.length > 0) {
        this.price.forEach(e => {
          if (e.tier_id !== undefined) {
            this.tier_info.push(e);
          }
        });
      }

      if (this.tierData.length > 0) {
        obj.tier_info = this.finalTier;
        if (obj.tier_info.length > 0) {
          this.commonservice.update_subscription(obj).subscribe((res: any) => {
            this.showSpinner = false;
            this.submitted = false;
            this.toastr.success('Subscriptions updated successfully!');
            this.commonservice.user_log({ message: 'User updated subscriptions succesfully!' }).subscribe(res => { });
            this.tier_info = [];
            this.description = [];
            this.enable = [];
            this.name = [];
            this.price = [];
            // this.checkTier();
            this.spinner.hide();
          }, err => {
            this.spinner.hide();
            this.showSpinner = false;
            this.toastr.error(err.error);
          });
        }


      }




      // this.tier_ilengthnfo.forEach(e => {


      //   if (this.editInfo.length > 0) {
      //     console.log('in length=======>');

      //     this.editInfo.forEach((element) => {
      //       console.log('in edit loop=======>');

      //       if (e.tier_id === element.tier_id) {
      //         console.log('in equal id=======>');

      //         element = (e)
      //         console.log(' this.editInfo=>', this.editInfo);
      //       }
      //     });
      //   } else {
      //     console.log('in else=======>');

      //     this.editInfo.push(e);
      //     console.log(' this.editInfo=>', this.editInfo);
      //   }
      // });

    }

    if (this.isEdit && this.isaddTier) {

      this.spinner.show();
      this.tier_info = [];
      this.editInfo = [];
      this.showSpinner = true;
      let obj = {
        opt: 'add',
        tier_info: ''
      }
      console.log('this.tierData=>', this.tierData);

      this.tierData.forEach(e => {
        if (!e.tier_id) {
          this.tierId++;
          let tierEnable;
          if (e.tier_enabled == '') {
            tierEnable = false;
          } else {
            tierEnable = true;
          }
          this.editInfo.push({
            tier_name: e.tier_name,
            tier_description: e.tier_description,
            tier_price: e.tier_price,
            tier_enabled: tierEnable,
            tier_id: this.tierId,
            creator_id: this.userId
          });
        }
      });
      obj.tier_info = this.editInfo;
      console.log('add with update obj=>', obj);

      this.commonservice.update_subscription(obj).subscribe((res: any) => {
        this.tier_info = []; this.tierData = [];
        this.isaddTier = false;
        // this.subscriptionForm.controls['tierArray'].reset();
        this.isEdit = true;


        this.userId = res.user_id;
        res.tiers.forEach((e) => {
          this.tierId = e.tier_id;
          if (e.tier_price > 0) {
            this.tierData.push(e);
          }
        });

        this.freetierdetail = res.tiers;
        this.updateTier(this.tierData);

        this.isAdd = false;
        if (res.tiers.length >= 3) {
          this.allowAdd = false;
        } else if (res.tiers.length < 3) {
          this.allowAdd = true;
        }
        this.submitted = false;
        this.showSpinner = false;
        this.toastr.success('Subscriptions added successfully!');
        this.commonservice.user_log({ message: 'User added subscriptions succesfully!' }).subscribe(res => { });
        this.spinner.hide();
        console.log('tierData=>', this.tierData);

      }, err => {
        this.spinner.hide();
        this.showSpinner = false;
        this.toastr.error(err.error.message);
      });

    }

    if (this.isfree) {
      this.spinner.show();
      this.showSpinner = true;
      let obj = {
        opt: 'update',
        tier_info: this.enableFree
      }
      this.commonservice.update_subscription(obj).subscribe((res: any) => {
        this.showSpinner = false;
        this.toastr.success('Subscriptions updated successfully!');
        this.commonservice.user_log({ message: 'User updated subscriptions succesfully!' }).subscribe(res => { });
        this.enableFree = [];
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        this.showSpinner = false;
        this.toastr.error(err.error.message);
      });
    }

    // if (this.isaddTier && this.isEdit) {
    //   this.spinner.show();
    //   this.showSpinner = true;
    //   let obj = {
    //     opt: 'add',
    //     tier_info: ''
    //   }



    //   this.tierData.forEach(e => {


    //     if (!e.tier_id) {
    //       this.tierId++;
    //       let tierEnable;
    //       if (e.tier_enabled == '') {
    //         tierEnable = false;
    //       } else {
    //         tierEnable = true;
    //       }
    //       this.editInfo.push({

    //         tier_name: e.tier_name,
    //         tier_description: e.tier_description,
    //         tier_price: e.tier_price,
    //         tier_enabled: tierEnable,
    //         tier_id: this.tierId,
    //         creator_id: this.userId
    //       });
    //     }
    //   });
    //   obj.tier_info = this.editInfo;
    //   this.commonservice.update_subscription(obj).subscribe((res: any) => {
    //     this.tier_info = [];
    //     this.submitted = false;
    //     this.subscriptionForm.controls['tierArray'].reset();
    //     this.showSpinner = false;
    //     this.checkTier();
    //     this.toastr.success('Subscriptions added successfully!');
    //     this.commonservice.user_log({ message: 'User added subscriptions succesfully!' }).subscribe(res => { });
    //     this.spinner.hide();
    //   }, err => {
    //     this.spinner.hide();
    //     this.showSpinner = false;
    //     this.toastr.error(err.error.message);
    //   });
    // }





  }

  removeTier(index: number, id) {


    if (id === undefined) {
      if (this.isButtonClicked) {
        this.spinner.show();
        const ind = index + 1;

        let obj = {
          opt: 'remove',
          tier_id: ind
        }
        console.log('obj=>', obj);

        this.commonservice.update_subscription(obj).subscribe((res: any) => {
          // this.checkTier();
          this.spinner.hide();
          this.toastr.success('Tier deleted successfully!');
          delete this.tierData[index];
          this.tierArray.removeAt(index);

          const array = [];
          for (let i = 0; i < this.tierData.length; i++) {
            if (this.tierData[i] !== undefined) {
              array.push(this.tierData[i]);
            }
          }
          this.tierData = array;
          if (res.tiers.length >= 4) {
            this.allowAdd = false;
          } else if (res.tiers.length < 4) {
            this.allowAdd = true;
          }

        }, err => {
          this.spinner.hide();
          this.toastr.error(err.error.message);
        });

      }
      else { !this.submitted } {
        delete this.tierData[index];
        this.tierArray.removeAt(index);

        const array = [];
        for (let i = 0; i < this.tierData.length; i++) {
          if (this.tierData[i] !== undefined) {
            array.push(this.tierData[i]);
          }
        }
        this.tierData = array;
      }


    }
    else if (id === 0) {
      this.toastr.error('You can not dlete default tier');
    } else {
      this.spinner.show();
      let obj = {
        opt: 'remove',
        tier_id: id
      }


      this.commonservice.update_subscription(obj).subscribe((res: any) => {
        // this.checkTier();
        this.spinner.hide();
        this.toastr.success('Tier deleted successfully!');
        delete this.tierData[index];
        this.tierArray.removeAt(index);

        const array = [];
        for (let i = 0; i < this.tierData.length; i++) {
          if (this.tierData[i] !== undefined) {
            array.push(this.tierData[i]);
          }
        }
        this.tierData = array;
        if (res.tiers.length >= 4) {
          this.allowAdd = false;
        } else if (res.tiers.length < 4) {
          this.allowAdd = true;
        }

      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.message);
      });
    }

    // if(this.isEdit){
    //   f(id === undefined){}
    // }


  }

}
