import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreatorRoutingModule } from './creator-routing.module';
// import { DefaultLayoutComponent } from '../layout/default-layout/default-layout.component';
// import { NavbarComponent } from '../layout/navbar/navbar.component';
import { SettingsModule } from '../Shared/settings/settings.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreatorProfileComponent } from './creator-profile/creator-profile.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { GalleriaModule } from 'primeng/galleria';
import { ProgressBarModule } from 'primeng/progressbar';
import { DropdownModule } from 'primeng/dropdown';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CalendarModule } from 'primeng/calendar';
import { ImageViewerModule } from 'ngx-image-viewer';
import { sharedModule } from '../Shared/shared.module';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { BsDropdownModule, } from 'ngx-bootstrap';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { AllPostComponent } from './all-post/all-post.component';
import { NgxSummernoteModule } from 'ngx-summernote';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CommonService } from '../service/common.service';
import { Interceptor } from '../service/interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
// import { ViewMediaComponent } from './view-media/view-media.component';
@NgModule({
  declarations: [
    // DefaultLayoutComponent,
    // NavbarComponent,
    CreatorProfileComponent,
    AllPostComponent,
    // ViewMediaComponent
  ],

  imports: [
    CommonModule,
    CreatorRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    OwlNativeDateTimeModule,
    BsDropdownModule.forRoot(),
    SettingsModule,
    TooltipModule,
    CarouselModule,
    NgxDropzoneModule,
    GalleriaModule,
    ProgressBarModule,
    DropdownModule,
    ConfirmDialogModule,
    CalendarModule,
    SplitButtonModule,
    RadioButtonModule,
    NgxSummernoteModule,
    MultiSelectModule,
    sharedModule,
    FileUploadModule,
    CheckboxModule,
    InputSwitchModule,
    NgxMaterialTimepickerModule,
    ImageViewerModule.forRoot(),
    OwlDateTimeModule,

  ],
  providers: [CommonService, ConfirmationService, {
    provide:
      HTTP_INTERCEPTORS,
    useClass: Interceptor,
    multi: true
  },]

})
export class CreatorModule { }
