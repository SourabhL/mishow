import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { environment } from '../../../environments/environment';
@Injectable()
export class AuthService {
    isProd: Boolean = false;
    isStaging: Boolean = false;
    constructor(public router: Router, private activatedRoute: ActivatedRoute) {
        this.isProd = environment.production;
        this.isStaging = environment.staging;
        // const url: string = state.url;
    }
    // ...
    public isAuthenticated(): boolean {
        const token = localStorage.getItem('id_token');

        if (!token) {

            return false;
        } else {
            return true;
        }
    }
}
