import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingNavigationComponent } from './setting-navigation/setting-navigation.component';
import { AccountSettingComponent } from './account-setting/account-setting.component';
import { PrivacySettingComponent } from './privacy-setting/privacy-setting.component';
import { SubcriptionSettingComponent } from './subcription-setting/subcription-setting.component';
import { NotificationSettingComponent } from './notification-setting/notification-setting.component';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TabViewModule } from 'primeng/tabview';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { BsDropdownModule } from 'ngx-bootstrap';
import { CarouselModule } from 'ngx-bootstrap/carousel';
@NgModule({
  declarations: [
    SettingNavigationComponent,
    AccountSettingComponent,
    PrivacySettingComponent,
    SubcriptionSettingComponent,
    NotificationSettingComponent,
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    DropdownModule,
    NgxSpinnerModule,
    ConfirmDialogModule,
    NgxDropzoneModule,
    FileUploadModule,
    FormsModule,
    MultiSelectModule,
    CalendarModule,
    ReactiveFormsModule,
    InputSwitchModule,
    CarouselModule,
    TabViewModule,
    RadioButtonModule,
    BsDropdownModule.forRoot()
  ],
  providers: [ConfirmationService]
})
export class SettingsModule { }
