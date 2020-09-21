import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonService } from './service/common.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DefaultLayoutComponent } from './layout/default-layout/default-layout.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CommonModule, registerLocaleData } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { sharedModule } from './Shared/shared.module';
import { Interceptor } from './service/interceptor';
import { DropdownModule } from 'primeng/dropdown';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CheckboxModule } from 'primeng/checkbox';
import { SQSService } from './service/sqs.service';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SplitButtonModule } from 'primeng/splitbutton';
import { BsDropdownModule } from 'ngx-bootstrap';
import localeFr from '@angular/common/locales/fr';
import localeFrExtra from '@angular/common/locales/extra/fr';
import { RoleGuardService } from './service/auth/role-guard.service';
import { ViewMediaComponent } from './creator/view-media/view-media.component';
import { NgxSummernoteModule } from 'ngx-summernote';

import { TooltipModule } from 'primeng/tooltip'
import { ViewPostComponent } from './subscriber/view-post/view-post.component';
import { ProgressBarModule } from 'primeng/progressbar';

registerLocaleData(localeFr, 'fr-FR', localeFrExtra);
@NgModule({
  declarations: [
    AppComponent,
    DefaultLayoutComponent,
    NavbarComponent,
    ViewMediaComponent,
    ViewPostComponent

  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    CarouselModule,
    ReactiveFormsModule,
    HttpClientModule,
    RadioButtonModule,
    CheckboxModule,
    ConfirmDialogModule,
    NgxSpinnerModule,
    CalendarModule,
    NgxSummernoteModule,
    TooltipModule,
    SplitButtonModule,
    DropdownModule,
    BsDropdownModule.forRoot(),
    sharedModule,
    MultiSelectModule,
    ProgressBarModule,
    ModalModule.forRoot(),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-left',
      preventDuplicates: true,
      closeButton: true,
      timeOut: 1000,
      // disableTimeOut: true,
      // autoDismiss: false
    }),
  ],

  providers: [

    RoleGuardService,
    CommonService,
    SQSService,
    ConfirmationService,
    {
      provide:
        HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
