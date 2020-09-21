import { Injectable } from '@angular/core';
import {
    Router,
    CanActivate,
    ActivatedRouteSnapshot
} from '@angular/router';
import decode from 'jwt-decode';
import { CommonService } from '../common.service';
@Injectable()
export class RoleGuardService implements CanActivate {
    constructor(public router: Router, private commonservice: CommonService) { }
    canActivate(route: ActivatedRouteSnapshot): boolean {
        // this will be passed from the route config
        // on the data property
        const expectedRole = route.data.expectedRole;
        const token = localStorage.getItem('id_token');
        // decode the token to get its payload
        const tokenPayload = this.commonservice.getLoggedUserDetail();

        if (
            !token ||
            tokenPayload['cognito:groups'][0] !== expectedRole
        ) {


            this.router.navigate(['/']);
            return false;
        } else {


            return true;
        }
    }
}