import { Component, HostListener } from '@angular/core';
import { RoleGuardService } from './service/auth/role-guard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mishow-frontend';
  constructor(
    private roleGuard: RoleGuardService,
  ) { }
  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault();
  }
}
