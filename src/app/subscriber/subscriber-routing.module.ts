import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePageComponent } from '../Shared/home-page/home-page.component';
import { ViewDownloadPackComponent } from '../Shared/view-download-pack/view-download-pack.component';
import { SubscribersComponent } from '../Shared/subscribers/subscribers.component';

import { SubscriberProfileComponent } from './subscriber-profile/subscriber-profile.component';
import { ViewProfileComponent } from '../Shared/view-profile/view-profile.component';
import { RoleGuardService } from '../service/auth/role-guard.service';
import { NotificationAllComponent } from '../Shared/notification-all/notification-all.component';
import { ViewPostComponent } from './view-post/view-post.component';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'profile',
    component: SubscriberProfileComponent,
    data: { title: 'profile', expectedRole: 'Subscriber' },
    canActivate: [RoleGuardService],
  },

  {
    path: 'view_pack',
    component: ViewDownloadPackComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRole: 'Subscriber'
    },
  },

  {
    path: 'notification',
    component: NotificationAllComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRole: 'Subscriber'
    },
  },

  {
    path: 'settings',
    canActivate: [RoleGuardService],
    data: {
      expectedRole: 'Subscriber'
    },
    loadChildren: () => import('../Shared/settings/settings.module').then(m => m.SettingsModule),
  },

  // {
  //   path: 'following/:id',
  //   component: SubscribersComponent,
  //   data: {
  //     title: 'following', expectedRole: 'Subscriber'
  //   },
  //   canActivate: [RoleGuardService],
  // },

  // {
  //   path: 'mi.show/:username',
  //   component: ViewProfileComponent,
  //   data: {
  //     title: 'viewProfile', expectedRole: 'Subscriber'
  //   },
  //   canActivate: [RoleGuardService],
  // },



  {
    path: 'viewpack/:id',
    component: ViewDownloadPackComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRole: 'Subscriber'
    },
  },

  // {
  //   path: 'showsubscribers/:id',
  //   component: SubscribersComponent,
  //   data: {
  //     title: 'subscriber'
  //   }, canActivate: [RoleGuardService],

  // },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriberRoutingModule { }
