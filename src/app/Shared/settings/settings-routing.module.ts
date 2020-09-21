import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingNavigationComponent } from './setting-navigation/setting-navigation.component';
import { AccountSettingComponent } from './account-setting/account-setting.component';
import { SubcriptionSettingComponent } from './subcription-setting/subcription-setting.component';
import { PrivacySettingComponent } from './privacy-setting/privacy-setting.component';
import { NotificationSettingComponent } from './notification-setting/notification-setting.component';



const routes: Routes = [
  {
    path: '',
    component: SettingNavigationComponent,
    children: [
      {
        path: 'account_setting',
        component: AccountSettingComponent,
        data:
        {
          title: 'account'
        }
      },
      {
        path: 'notification_setting',
        component: NotificationSettingComponent,
        data:
        {
          title: 'notification'
        }
      },
      {
        path: 'privacy_setting',
        component: PrivacySettingComponent,
        data:
        {
          title: 'privacy'
        }
      },
      {
        path: 'subscription_setting',
        component: SubcriptionSettingComponent,
        data:
        {
          title: 'subscription'
        }
      },
      {
        path: 'payment_setting',
        // component: PaymentComponent,
        loadChildren: () => import('./payment-settings/payment-settings.module').then(m => m.PaymentSettingsModule),
        data:
        {
          title: 'payment'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
