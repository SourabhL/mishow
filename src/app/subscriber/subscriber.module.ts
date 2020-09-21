import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubscriberRoutingModule } from './subscriber-routing.module';
import { SubscriberProfileComponent } from './subscriber-profile/subscriber-profile.component';
import { sharedModule } from '../Shared/shared.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SettingsModule } from '../Shared/settings/settings.module';
import { Interceptor } from '../service/interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { BsDropdownModule, CarouselModule } from 'ngx-bootstrap';
import { MultiSelectModule } from 'primeng/multiselect';
// import { ViewPostComponent } from './view-post/view-post.component';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressBarModule } from 'primeng/progressbar';
import { NgxSummernoteModule } from 'ngx-summernote';


@NgModule({
  declarations: [
    SubscriberProfileComponent,
    // ViewPostComponent,
  ],
  imports: [
    CommonModule,
    SubscriberRoutingModule,
    sharedModule,
    ConfirmDialogModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    NgxSpinnerModule,
    SettingsModule,
    NgxDropzoneModule,
    MultiSelectModule,
    CarouselModule,
    ProgressBarModule,
    DropdownModule,
    CheckboxModule,
    NgxSummernoteModule,
    TooltipModule,
    BsDropdownModule.forRoot(),

  ],
  providers: [ConfirmationService, {
    provide:
      HTTP_INTERCEPTORS,
    useClass: Interceptor,
    multi: true
  },]
})
export class SubscriberModule { }
