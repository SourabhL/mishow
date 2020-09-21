import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PartnerAgreementComponent } from './partner-agreement/partner-agreement.component';
import { PaymentsComponent } from './payments/payments.component';
import { BankDetailComponent } from './bank-detail/bank-detail.component';
import { CardDetailComponent } from './card-detail/card-detail.component';
import { ReleaseAgreementComponent } from './release-agreement/release-agreement.component';
import { PaymentsNavigationComponent } from './payments-navigation/payments-navigation.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentsNavigationComponent,
    children: [
      {
        path: 'payment',
        component: PaymentsComponent
      },
      {
        path: 'partner_agreement',
        component: PartnerAgreementComponent
      },
      {
        path: 'release_agreement',
        component: ReleaseAgreementComponent
      },
      {
        path: 'add_bank',
        component: BankDetailComponent
      },
      {
        path: 'add_card',
        component: CardDetailComponent
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentSettingsRoutingModule { }
