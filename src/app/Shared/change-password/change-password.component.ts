import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from 'src/app/service/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  ChangePasswordForm: FormGroup;
  submitted = false;
  show_spinner = false;
  constructor(private commonservice: CommonService,
    private toastr: ToastrService) {
    this.formInit();
  }


  formInit = () => {
    this.ChangePasswordForm = new FormGroup({
      'user_name': new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      'password': new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      'new_password': new FormControl('',
        [Validators.compose([
          Validators.required,
          this.noWhitespaceValidator,
          Validators.minLength(8),
          Validators.pattern(/((?=.*\d)(?=.*[a-z]))/)])]
      )
    });
  }

  //function for checking there is no white space in input.
  noWhitespaceValidator(control: FormControl) {
    if (typeof (control.value || '') === 'string' || (control.value || '') instanceof String) {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { 'whitespace': true };
    }
  }
  ngOnInit() {
  }
  onSubmit(valid) {
    this.submitted = true;
    this.show_spinner = true;
    if (valid) {
      //   this.commonservice.change_password(this.ChangePasswordForm.value).subscribe(res => {
      //     this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
      //     this.show_spinner = false;
      //   }, err => {
      //     this.toastr.error(err.error, 'Error!', { timeOut: 3000 });
      //     this.show_spinner = false;
      //   });
    }
  }

}
