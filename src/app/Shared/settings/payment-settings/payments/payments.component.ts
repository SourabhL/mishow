import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Router } from '@angular/router';
@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  userDetails: any = [];
  savedCard: any = [];
  paymentList: any = [];
  payoutList: any = [];
  purchaseList: any = [];
  isCreator = false;
  isAgreement = false;
  isSubscriber = false;
  paymentSkip = 0;
  paymentLimit = 10;
  purchaseSkip = 0;
  purchaseLimit = 10;
  payoutSkip = 0;
  payoutLimit = 10;
  isPayment = false;
  test: any = [];
  showLink = false;
  isPurchase = false;
  isPayout = false;
  modalRef: BsModalRef;
  transactionDetails: any = [];
  isPurchaseNote = false;
  isPaymentNote = false;
  linkMessage: any;
  isPayoutNote = false;
  message: any;
  detailMessage: any;
  isPaymentLimit = false;
  isPurchaseLimit = false;
  isPayoutLimit = false;
  transactionID: any;
  noteValue: any;
  noteModule: any;
  transactionData: any;
  type: any;
  noteArray: any = [];
  constructor(
    private commonservice: CommonService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private route: Router) {
    this.spinner.show();
    this.userDetails = this.commonservice.getLoggedUserDetail();

    if (this.userDetails['cognito:groups'][0] === "Subscriber") {
      this.isSubscriber = true;
    } else {
      this.isCreator = true;
    }

    this.commonservice.get_agreement().subscribe((res: any) => {
      if (res) {
        this.isAgreement = false;
      }
    }, err => {
      this.isAgreement = true;
    });
    this.commonservice.getCardDetail().subscribe((res: any) => {
      if (res.profile.paymentProfiles) {
        res.profile.paymentProfiles.forEach(e => {
          this.savedCard.push({
            cardNumber: e.payment.creditCard.cardNumber.split('X').pop(),
            expiration: e.payment.creditCard.expirationDate,
            type: e.payment.creditCard.cardType,
            show: true,
            paymentProfileID: e.customerPaymentProfileId
          })
        });
      }

    }, err => {

    });

    this.commonservice.getPurchase(this.userDetails.sub, this.purchaseSkip, this.purchaseLimit).subscribe((res: any) => {

      this.isPurchase = true;
      if (res.length == 10) {
        this.isPurchaseLimit = true;
      } else {
        this.isPurchaseLimit = false;
      }


      res.forEach(e => {
        let dt1 = this.commonservice.scheduleDate(e.created_at);
        if (e.payment_id !== null) {
          this.purchaseList.push({
            date: moment(dt1, 'YYYY-MM-DD').format('MMMM DD, YYYY'),
            description: e.asset.description,
            amount: e.payment_info.total_payment,
            data: e
          });
        }
      });
    });

    this.commonservice.getPayments(this.userDetails.sub, this.paymentSkip, this.paymentLimit).subscribe(payment => {
      this.isPayment = true;

      if (payment.length == 10) {
        this.isPaymentLimit = true;
      } else if (payment.length < 10) {
        this.isPaymentLimit = false;
      }

      payment.forEach(e => {
        let dt1 = this.commonservice.scheduleDate(e.created_at);
        if (e.payment_id !== null) {
          this.paymentList.push({
            date: moment(dt1, 'YYYY-MM-DD').format('MMMM DD, YYYY'),
            description: e.asset.description,
            amount: e.payment_info.total_payment,
            fee: e.payment_info.platform_fee_creator,
            net: e.payment_info.creator_net,
            data: e
          });
        }

      });
    });


    this.commonservice.getPayments(this.userDetails.sub, this.payoutSkip, this.payoutLimit).subscribe(payout => {
      this.isPayout = true;
      if (payout.length == 10) {
        this.isPayoutLimit = true;
      } else {
        this.isPayoutLimit = false;
      }

      payout.forEach(e => {
        let dt1 = this.commonservice.scheduleDate(e.created_at);
        if (e.payout_id !== null) {
          this.payoutList.push({
            date: moment(dt1, 'YYYY-MM-DD').format('MMMM DD, YYYY'),
            description: e.asset.description,
            amount: e.payment_info.total_payment,
            data: e
          });


        }


      });
    });



    this.spinner.hide();
  }



  deleteCard(arr) {

    this.commonservice.deleteCard(arr.paymentProfileID).subscribe(res => {
      arr.show = false;
      this.toastr.success('Card Deleted successfully');
    }, err => {
      this.toastr.error(err.error.message);
    });

  }

  showtransaction(type, temp, data) {
    this.showLink = false;

    this.transactionDetails = [];
    this.type = type;
    if (type === 'payment') {
      this.isPaymentNote = true;
      this.message = 'payment received from : @';
    }

    if (type === 'payout') {
      this.isPayoutNote = true;
    }

    if (type === 'purchase') {
      this.isPurchaseNote = true;
      this.message = 'Purchase from : @';
    }

    if (data.asset.type === "product" || data.asset.type === "pack") {
      this.detailMessage = data.asset.username + ' for ' + data.payment_info.total_payment + ' '
        + data.asset.type + ' purchases';
      if (data.asset.type === "pack") {
        this.showLink = true;
        this.linkMessage = "Show Pack Content";
      }
    }


    if (data.asset.type === "exclusive") {
      this.detailMessage = data.asset.username + ' for ' + data.payment_info.total_payment + ' '
        + data.asset.type + ' contribution';
      this.showLink = true;
      this.linkMessage = "Show Exclusive Content";

    }

    if (data.asset.type === "subscription") {
      this.detailMessage = data.asset.username + ' for ' + data.payment_info.total_payment
        + ' tier monthly subscription';
    }
    this.modalRef = this.modalService.show(temp, { class: 'TransactionsWrap' });

    let dt = data.created_at.split('-');
    let dt1 = dt[0] + '-' + dt[1] + '-' + dt[2] + ' ' + dt[3];
    data.created_at = moment(dt1, 'YYYY-MM-DD kk:mm:ss').format('MMMM Do, YYYY HH:MM a');

    data.notes.forEach(element => {
      let dtNote = element.created_at.split('-');
      let dtNote1 = dtNote[0] + '-' + dtNote[1] + '-' + dtNote[2] + ' ' + dtNote[3];
      element.created_at = moment(dtNote1, 'YYYY-MM-DD kk:mm:ss').format('MMMM Do, YYYY HH:MM a');
      if (element['Username for Social Media']) {
        element.socialMedia = element['Username for Social Media']
      }

      if (element['Mailing Address']) {
        element.address = element['Mailing Address']
      }
    });

    this.transactionDetails = data;

  }

  openNotes(temp, transid) {
    this.transactionID = transid;
    this.modalRef.hide();
    this.modalRef = null;
    this.modalRef = this.modalService.show(temp);
  }

  viewContent(type, id) {
    this.modalRef.hide();
    this.modalRef = null;
    this.route.navigate(['/' + type + '/' + id]);
  }

  addNotes(type, temp) {

    let time = moment(new Date()).format('YYYY-MM-DD-kk:mm:ss');
    this.noteArray = ({ 'notes': this.noteModule, 'username': this.userDetails.username, 'created_at': time })
    this.commonservice.addNoteToPayment(this.transactionID, this.noteArray).subscribe((res: any) => {
      this.toastr.success('Note added!');
      this.modalRef.hide();
      this.modalRef = null;
      this.showtransaction(type, temp, res);
    }, err => {
      this.toastr.error(err);
      this.modalRef.hide();
      this.modalRef = null;
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


  ngOnInit() {
  }

  LoadMore(key) {
    if (key === 'purchase') {
      this.purchaseList = [];
      this.purchaseSkip = this.purchaseSkip + this.purchaseLimit;
      this.commonservice.getPurchase(this.userDetails.sub, this.purchaseSkip, this.purchaseLimit).subscribe((res: any) => {
        res.forEach(e => {
          let dt1 = this.commonservice.scheduleDate(e.created_at);
          if (e.payment_id !== null) {
            this.purchaseList.push({
              date: moment(dt1, 'YYYY-MM-DD').format('MMMM DD, YYYY'),
              description: e.asset.description,
              amount: e.payment_info.amount,

            });
          }
        });

      });

    }

    if (key === 'payments') {
      this.paymentList = [];
      this.paymentSkip = this.paymentSkip + this.paymentLimit;
      this.commonservice.getPayments(this.userDetails.sub, this.paymentSkip, this.paymentLimit).subscribe(purchase => {
        purchase.forEach(e => {
          let dt1 = this.commonservice.scheduleDate(e.created_at);

          if (e.payment_id !== null) {
            this.paymentList.push({
              date: moment(dt1, 'YYYY-MM-DD').format('MMMM DD, YYYY'),
              description: e.asset.description,
              amount: e.payment_info.amount,

            });
          }

        })
      });
    }

    if (key === 'payout') {
      this.payoutList = [];
      this.payoutSkip = this.payoutSkip + this.payoutLimit;
      this.commonservice.getPayments(this.userDetails.sub, this.payoutSkip, this.payoutLimit).subscribe(purchase => {
        purchase.forEach(e => {
          let dt1 = this.commonservice.scheduleDate(e.created_at);
          if (e.payout_id !== null) {
            this.payoutList.push({
              date: moment(dt1, 'YYYY-MM-DD').format('MMMM DD, YYYY'),
              description: e.asset.description,
              amount: e.payment_info.amount,

            });
          }

        })
      });
    }
  }
}
