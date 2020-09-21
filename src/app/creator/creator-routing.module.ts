import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangePasswordComponent } from '../Shared/change-password/change-password.component';
import { CreatorProfileComponent } from './creator-profile/creator-profile.component';
import { HomePageComponent } from '../Shared/home-page/home-page.component';

import { NotificationAllComponent } from '../Shared/notification-all/notification-all.component';
import { AllPostComponent } from './all-post/all-post.component';
import { ChatComponent } from '../Shared/chat/chat.component';
import { ViewProfileComponent } from '../Shared/view-profile/view-profile.component';
import { ViewDownloadPackComponent } from '../Shared/view-download-pack/view-download-pack.component';

import { SubscribersComponent } from '../Shared/subscribers/subscribers.component';
import { RoleGuardService } from '../service/auth/role-guard.service';
import { ViewMediaComponent } from './view-media/view-media.component';



const routes: Routes = [

  {
    path: '',
    component: HomePageComponent,
  },

  {
    path: 'profile',
    component: CreatorProfileComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRole: 'Creator', title: 'profile'
    },
  },

  {
    path: 'allpost',
    canActivate: [RoleGuardService],
    data: {
      expectedRole: 'Creator', title: 'add'
    },
    component: AllPostComponent,
  },

  {
    path: 'edit/:type/:id',
    canActivate: [RoleGuardService],
    data: {
      expectedRole: 'Creator', title: 'edit'
    },
    component: AllPostComponent,
  },

  {
    path: 'settings',
    canActivate: [RoleGuardService],
    data: {
      expectedRole: 'Creator'
    },
    loadChildren: () => import('../Shared/settings/settings.module').then(m => m.SettingsModule),
  },

  {
    path: 'notification',
    canActivate: [RoleGuardService],
    data: {
      expectedRole: 'Creator'
    },
    component: NotificationAllComponent,
  },

  {
    path: 'change_password',
    canActivate: [RoleGuardService],
    data: {
      expectedRole: 'Creator'
    },
    component: ChangePasswordComponent
  },

  {
    path: 'chat',
    canActivate: [RoleGuardService],
    data: {
      expectedRole: 'Creator'
    },
    component: ChatComponent
  },



  {
    path: 'viewpack/:id',
    canActivate: [RoleGuardService],
    data: {
      expectedRole: 'Creator'
    },
    component: ViewDownloadPackComponent
  },

  {
    path: 'subscribers/:id',
    canActivate: [RoleGuardService],
    data: {
      expectedRole: 'Creator', title: 'subscriber'
    },
    component: SubscribersComponent,
  },

  {
    path: 'following/:id',
    canActivate: [RoleGuardService],
    data: {
      expectedRole: 'Creator', title: 'following'
    },
    component: SubscribersComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreatorRoutingModule { }
