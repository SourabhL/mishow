import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpRequest, HttpClient, HttpErrorResponse } from "@angular/common/http";
import { HttpInterceptor } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { CommonService } from './common.service';
import { retry, catchError } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable()
export class Interceptor implements HttpInterceptor {
    userDetail: any = [];
    constructor(private http: HttpClient,
        private commonservice: CommonService,
        private route: Router) { }


    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.userDetail = this.commonservice.getLoggedUserDetail();

        const token = localStorage.getItem('id_token');

        if (token) {
            if (this.userDetail !== '') {
                if (new Date().getTime() < (this.userDetail.exp * 1000)) {
                    req = req.clone({
                        setHeaders: {
                            Authorization: token
                        }
                    });
                } else {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('id_token');
                    this.commonservice.refreshToken(localStorage.getItem('username'), { refresh_token: localStorage.getItem('refresh_token') }).subscribe((token: any) => {
                        localStorage.setItem('access_token', token.access_token);
                        localStorage.setItem('id_token', token.id_token);
                    }, err => {
                        // this.route.navigate(['/']);
                    });
                }

            }

        }
        return next.handle(req);
        // }

        // .pipe(retry(1),
        //     catchError((error: HttpErrorResponse) => {
        //         // console.log({ error });
        //         // console.log('error.status=>', error.status);

        //         // console.log('(error.error=>', error.error);
        //         // console.log('(error.error  s =>', error.error.status);
        //         // console.log('(error.error   m =>', error.error.message);
        //         let errorMessage = '';
        //         if (error.error instanceof ErrorEvent) {
        //             // client-side error
        //             errorMessage = `Error: ${error.error.message}`;
        //         } else {
        //             // server-side error
        //             // console.log('interceptor => error =>', error.message);
        //             // console.log('interceptor => status =>', error.headers.get('status'));

        //             errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        //         }
        //         // window.alert(errorMessage);
        //         return throwError(errorMessage);
        //     })
        // );

    }
}
