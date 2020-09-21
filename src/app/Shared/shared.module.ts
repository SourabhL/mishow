
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ForgotPasswordComponent } from '../Shared/forgot-password/forgot-password.component';
import { ModalModule, BsDropdownModule } from 'ngx-bootstrap';
import { CommonModule } from '@angular/common';
import { BrowseComponent } from '../Shared/browse/browse.component';
import { HomePageComponent } from '../Shared/home-page/home-page.component';
import { TooltipModule } from 'primeng/tooltip';
import { CalendarModule } from 'primeng/calendar';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SettingsModule } from './settings/settings.module';
import { ViewDownloadPackComponent } from './view-download-pack/view-download-pack.component';
import { LightboxModule } from 'primeng/lightbox';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { NotificationAllComponent } from './notification-all/notification-all.component';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ChatComponent } from './chat/chat.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { SubscribersComponent } from './subscribers/subscribers.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { NgxSummernoteModule } from 'ngx-summernote';
import { NgxCopyToClipboardModule } from 'ngx-copy-to-clipboard';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
@NgModule({
    declarations: [
        ForgotPasswordComponent,
        BrowseComponent,
        ChangePasswordComponent,
        HomePageComponent,
        ViewDownloadPackComponent,
        ViewProfileComponent,
        NotificationAllComponent,
        ChatComponent,
        LandingPageComponent,
        SubscribersComponent,
        PrivacyPolicyComponent
    ],
    imports: [
        CommonModule,
        CalendarModule,
        FormsModule,
        CarouselModule,
        ConfirmDialogModule,
        BsDropdownModule.forRoot(),
        DropdownModule,
        ReactiveFormsModule,
        SettingsModule,
        CheckboxModule,
        HttpClientModule,
        MultiSelectModule,
        ProgressBarModule,
        RadioButtonModule,
        NgxSummernoteModule,
        LightboxModule,
        ModalModule.forRoot(),
        TooltipModule,
        NgxCopyToClipboardModule,
        InfiniteScrollModule
    ],
    providers: [],

})
export class sharedModule { }
