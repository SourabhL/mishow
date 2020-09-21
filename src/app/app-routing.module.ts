import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultLayoutComponent } from './layout/default-layout/default-layout.component';
import { LandingPageComponent } from './Shared/landing-page/landing-page.component';
import { PrivacyPolicyComponent } from './Shared/privacy-policy/privacy-policy.component';
import { ViewProfileComponent } from './Shared/view-profile/view-profile.component';
import { ViewMediaComponent } from './creator/view-media/view-media.component';
import { ViewPostComponent } from './subscriber/view-post/view-post.component';
import { SubscribersComponent } from './Shared/subscribers/subscribers.component';

const routes: Routes = [
  // { path: '', component: HomepageComponent },
  {
    path: '',
    component: LandingPageComponent
  },
  {
    path: 'privacypolicy',
    component: PrivacyPolicyComponent,
    data: {
      title: 'privacy'
    }
  },
  {
    path: 'terms',
    component: PrivacyPolicyComponent,
    data: {
      title: 'terms'
    }
  },
  {
    path: '2257',
    component: PrivacyPolicyComponent,
    data: {
      title: 'usc'
    }
  },
  {
    path: 'howitworks',
    component: PrivacyPolicyComponent,
    data: {
      title: 'howitworks'
    }
  },
  {
    path: 'dmca',
    component: PrivacyPolicyComponent,
    data: {
      title: 'dmca'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      // { path: 'registration', component: RegistrationComponent },
      // { path: 'login', component: LoginComponent },
      // { path: 'forgot_password', component: ForgotPasswordComponent },
      // { path: 'browse', component: BrowseComponent },
      // {
      //   path: 'landingPage',
      //   component: LandingPageComponent
      // },
      // {
      //   path: 'mi.show/:username',
      //   component: ViewProfileComponent,
      //   data: {
      //     title: 'viewProfile'
      //   }
      // },
      // {
      //   path: 'mi.show/:username/:type/:id',
      //   component: ViewMediaComponent,
      //   data: {
      //     title: 'viewMedia'
      //   }
      // },
      // {
      //   path: 'viewpack/:id',
      //   component: ViewDownloadPackComponent
      // },
      // {
      //   path: 'subscribers/:id',
      //   component: SubscribersComponent,
      //   data: {
      //     title: 'subscriber'
      //   }
      // },
      // {
      //   path: 'following/:id',
      //   component: SubscribersComponent,
      //   data: {
      //     title: 'following'
      //   }
      // },
      {
        path: 'creator',

        loadChildren: () => import('./creator/creator.module').then(m => m.CreatorModule),
      },
      {
        path: 'subscriber',

        loadChildren: () => import('./subscriber/subscriber.module').then(m => m.SubscriberModule),
      },
      {
        path: ':profileurl/following/:id',
        component: SubscribersComponent,
        data: {
          title: 'following',
        },
      },
      {
        path: ':profileurl/showsubscribers/:id',
        component: SubscribersComponent,
        data: {
          title: 'subscriber'
        },
      },

      {
        path: 'mi.show/:profileurl',

        data: {
          expectedRole: 'Creator', title: 'viewProfile'
        },
        component: ViewProfileComponent,
      },

      {
        path: ':type/:id',
        data: {
          expectedRole: 'Creator', title: 'viewMedia'
        },
        component: ViewMediaComponent,
      },
      {
        path: ':profileurl/:type/:id',
        component: ViewPostComponent,
        data: {
          title: 'viewPost', expectedRole: 'Subscriber'
        },

      },

    ]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
