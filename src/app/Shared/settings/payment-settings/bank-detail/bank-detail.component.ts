import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-bank-detail',
  templateUrl: './bank-detail.component.html',
  styleUrls: ['./bank-detail.component.css']
})
export class BankDetailComponent implements OnInit {
  bankForm: FormGroup;
  showSpinner = false;
  constructor() { this.formInit(); }

  ngOnInit() {
  }

  formInit = () => {
    this.bankForm = new FormGroup({
      accountName: new FormControl(''),
      bankName: new FormControl(''),
      routingNumber: new FormControl(''),
      accountNumber: new FormControl(''),
      confirmAccountNumber: new FormControl(''),
    });
  }
  onBankSubmit(valid) { }

}
