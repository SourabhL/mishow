import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentSettingsRoutingModule } from './payment-settings-routing.module';
import { PartnerAgreementComponent } from './partner-agreement/partner-agreement.component';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { ReleaseAgreementComponent } from './release-agreement/release-agreement.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { PaymentsComponent } from './payments/payments.component';
import { BankDetailComponent } from './bank-detail/bank-detail.component';
import { CardDetailComponent } from './card-detail/card-detail.component';
import { PaymentsNavigationComponent } from './payments-navigation/payments-navigation.component';
import { TabViewModule } from 'primeng/tabview';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [PartnerAgreementComponent, ReleaseAgreementComponent, PaymentsComponent, BankDetailComponent, CardDetailComponent, PaymentsNavigationComponent],
  imports: [
    CommonModule,
    PaymentSettingsRoutingModule,
    DropdownModule,
    CheckboxModule,
    CalendarModule,
    NgxDropzoneModule,
    ConfirmDialogModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    TooltipModule,
    CarouselModule,
    // NgxExtendedPdfViewerModule,
    TabViewModule
  ],
  providers: [ConfirmationService],
})
export class PaymentSettingsModule { }
