import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from 'src/app/service/common.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  ForgotPasswordForm: FormGroup;
  submitted = false;
  show_spinner = false;
  constructor(
    private commonservice: CommonService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.formInit();
  }

  ngOnInit() {
  }

  formInit = () => {
    this.ForgotPasswordForm = new FormGroup({
      'user_name': new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      'email': new FormControl('', [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])
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

  //on submit form
  onSubmit(valid) {
    this.submitted = true;
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
        this.toastr.error(err.error);
      })
    }
    else {

    }
  }
}
