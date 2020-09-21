import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import * as env from '../../environments/environment';
import jwt_decode from 'jwt-decode';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
// import { AES, enc } from 'crypto-ts';
// import * as  moment from 'moment';
// import { EmployerService } from '../views/employer/employer.service';
// import { CandidateService } from '../views/shared-components/candidates/candidate.service';
// import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
    providedIn: 'root'
})

export class CommonService {
    data: INotification;
    allImages: any = [];
    bucketName: any;
    token: any;
    config: any = {
        height: '200px',
        uploadImagePath: '/api/upload',
        toolbar: [

            ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript']],
            ['fontsize', ['fontsize', 'color']],
            ['para', ['style0', 'ul', 'ol', 'paragraph']]
        ]
    };
    detail = this.getLoggedUserDetail();
    private url = env.environment.API_URL;
    private profileurl = env.environment.PROFILE_URL;
    private profileSearchurl = env.environment.PROFILE_SEARCH;
    private ImageURL = env.environment.imageUrl;
    private Setting_url = env.environment.SETTING_URL;
    private posturl = env.environment.POST_URL;
    private packurl = env.environment.PACK_URL;
    private producturl = env.environment.PRODUCT_URL;
    private exclusiveurl = env.environment.EXCLUSIVE_URL;
    private tagsURL = env.environment.TAGS_URL;
    private logs = env.environment.LOGS;
    private partnerURL = env.environment.AGREEMENT_URL;
    private releaseURL = env.environment.RELEASE_URL;
    private moderation = env.environment.MODERATION;
    private payment = env.environment.PAYMENT;
    private taxesURL = env.environment.TAXES_URL;
    private subscriptionURL = env.environment.SUBSCRIPTION_URL;
    private commentURL = env.environment.COMMENTS;
    private voteURL = env.environment.VOTES;
    private hotlinkURL = env.environment.HOTLINK_URL;
    private secretKey = 'myhardpassword';
    private chatURL = env.environment.CHAT_URL;
    private categoryURL = env.environment.CATEGORY_URL;
    private notificationURL = env.environment.NOTIFICATION_URL;
    private offlineNotificationURL = env.environment.OFFLINE_NOTIFICATION_URL;
    private liveNotification = env.environment.LIVE_NOTIFICATION_URL;
    private quickQuastionURL = env.environment.QUICK_QUESTION_URL;
    private feedURL = env.environment.FEED_URL;
    private user = new BehaviorSubject('');
    private updatedUserDetail = new BehaviorSubject('');
    private filter = new BehaviorSubject('');
    private isViewProfile = new BehaviorSubject('');
    private profileID = new BehaviorSubject('');
    private subscription = new BehaviorSubject('');
    private remainingDays = new BehaviorSubject('');
    private notification = new BehaviorSubject('');
    private viewValue = new BehaviorSubject('');
    public CONFIG = this.config;

    getUser = this.user.asObservable();
    getupdatedUserDetail = this.updatedUserDetail.asObservable();
    getFilter = this.filter.asObservable();
    getViewProfile = this.isViewProfile.asObservable();
    getProfileID = this.profileID.asObservable();
    getSubscription = this.subscription.asObservable();
    getremainingDays = this.remainingDays.asObservable();
    getNotification = this.notification.asObservable();
    getValue = this.viewValue.asObservable();
    constructor(
        private http: HttpClient,
        private route: Router,
    ) { }



    // get location
    getPosition(): Promise<any> {
        return new Promise((resolve, reject) => {

            navigator.geolocation.getCurrentPosition(resp => {

                resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });
            },
                err => {
                    reject(err);
                });
        });

    }
    // Before Login
    signup(data): Observable<any[]> {
        return this.http.post<any[]>(`${this.url}` + 'users', data);
    }

    account_type(type): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}` + `users/update-account-type/` + type);
    }

    login(data): Observable<any[]> {
        return this.http.post<any[]>(`${this.url}` + 'users/login', data);
    }
    logout(data): Observable<any[]> {
        return this.http.post<any[]>(`${this.url}` + 'users/signout', data);
    }

    forgot_password(data): Observable<any[]> {
        return this.http.post<any[]>(`${this.url}` + '/users/forgetpassword', data);
    }
    // query parameters for validating username and email
    validations(key: string, value: any) {
        return this.http.get(`${this.url}` + '/users/validateuser?' + key + '=' + value);
    }

    // after login

    post_profile(data): Observable<any[]> {
        return this.http.post<any[]>(`${this.profileurl}` + 'profile', data);
    }
    edit_profile(data): Observable<any[]> {
        return this.http.put<any[]>(`${this.profileurl}` + 'profile', data);
    }
    get_profile(): Observable<any> {
        return this.http.get<any[]>(`${this.profileurl}` + 'profile');
    }



    refreshToken(username, data): Observable<any[]> {
        return this.http.post<any[]>(`${this.url}` + '/users/refreshlogin/' + username, data);
    }

    profile_creator(): Observable<any[]> {
        return this.http.get<any[]>(`${this.profileSearchurl}` + 'myprofile');
    }

    viewCreatorProfile(id): Observable<any[]> {
        return this.http.get<any[]>(`${this.profileSearchurl}` + 'myprofile' + '?profileId=' + id);
    }
    get_userDetail(): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}` + 'users/getuser');
    }
    change_email(data): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}` + 'users/change-email/' + data);
    }

    change_password(data): Observable<any[]> {
        return this.http.post<any[]>(`${this.url}` + '/users/changepassword', data);
    }
    update_userDetailes(data): Observable<any[]> {
        return this.http.put<any[]>(`${this.url}` + 'users', data);
    }

    disabled_user(): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}` + 'users/disable-user');
    }


    getUserDetails(userid): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}` + 'users/getuser?user_id=' + userid);
    }


    account_list(type, data): Observable<any[]> {
        return this.http.post<any[]>(`${this.profileurl}` + 'profile/list?filter=' + type, data);
    }



    feed(data): Observable<any[]> {
        return this.http.get<any[]>(`${this.profileSearchurl}` + 'profile/' + data);
    }
    voting(data): Observable<any[]> {
        return this.http.put<any[]>(`${this.voteURL}` + '/post/vote', data);
    }


    // view Profile
    viewProfile(profile_url): Observable<any[]> {
        return this.http.get<any[]>(`${this.profileurl}` + 'profile-by-url/' + profile_url);
    }
    getProfile_by_id(userID): Observable<any[]> {
        return this.http.get<any[]>(`${this.profileurl}` + 'profile-by-userid/' + userID);
    }

    // subscription
    subscribeWithPurchase(profileID, tierID, transactionID): Observable<any[]> {
        return this.http.get<any[]>(`${this.subscriptionURL}` + '/profile/subscribe/' + profileID + '?tierId=' + tierID + '&transactionId=' + transactionID);
    }

    subscribe(profileID): Observable<any[]> {
        return this.http.get<any[]>(`${this.subscriptionURL}` + '/profile/subscribe/' + profileID);
    }

    upgradeSubscription(profileID, tierID, transactionID): Observable<any[]> {
        return this.http.get<any[]>(`${this.subscriptionURL}` + '/profile/upgrade/' + profileID + '/' + tierID + '/' + transactionID);
    }

    freeSubscription(userID): Observable<any[]> {
        return this.http.get<any[]>(`${this.subscriptionURL}` + '/profile/subscribe/' + userID);
    }

    unSubscribe(profileID): Observable<any[]> {
        return this.http.get<any[]>(`${this.subscriptionURL}` + '/profile/unsubscribe/' + profileID);
    }

    // check subscription
    checkSubscription(profileID): Observable<any[]> {
        return this.http.get<any[]>(`${this.subscriptionURL}` + '/profile/get-subscription-status/' + profileID);
    }




    public setUser(data: string) {
        this.user.next(data);
    }
    public setupdatedUserDetail(data: any) {
        this.updatedUserDetail.next(data);
    }
    public setFilter(data: string) {
        this.filter.next(data);
    }
    public setViewProfile(data) {
        this.isViewProfile.next(data);
    }
    public setProfileID(data: any) {
        this.profileID.next(data);
    }
    public setSubscription(data) {
        this.subscription.next(data);
    }

    public setRemainingDays(data) {
        this.remainingDays.next(data);
    }

    public setNotification(data) {
        this.notification.next(data);
    }

    public setValue(data) {
        this.viewValue.next(data);

        console.log('this.viewValue.value=>', this.viewValue.value);

    }




    //  this.chatService.getMessage().subscribe((message: any) => {
    //      message.reply = false;
    //      if (message.user.name !== this.username) {
    //          this.messages.push(message);
    //      }
    //  });

    // upload image
    uploadImage(name): Observable<any[]> {

        return this.http.get<any[]>(`${this.ImageURL}` + '/upload/' + this.detail.sub + '/' + name);
    }

    getPresignURL(key, type, id, filename): Observable<any[]> {

        return this.http.get<any[]>(`${this.ImageURL}` + 'getpresignurl/' + key + '/' + type + '?file-name=' + id + '/' + filename);
    }

    getDownloadPresignURL(key, value): Observable<any[]> {

        return this.http.get<any[]>(`${this.ImageURL}` + 'getpresignurl/' + key + '/' + value);
    }

    getDeletePresignURL(key): Observable<any[]> {

        return this.http.delete<any[]>(`${this.ImageURL}` + 'delete-object/' + key);
    }



    getAllBuckets(): Observable<any[]> {
        return this.http.get<any[]>(`${this.ImageURL}`);
    }

    uplaod_image(api, data): Observable<any[]> {

        return this.http.put<any[]>(api, data);
    }
    // getImage(image): Observable<any[]> {
    //     console.log('image=>', image);

    //     return this.http.get<any[]>(`${this.ImageURL}` + '/' + image);
    // }

    // image moderation
    imageModeration(id, image): Observable<any[]> {
        return this.http.get<any[]>(`${this.moderation}` + 'image-moderation/' + id + '/' + image);
    }

    videoModeration(id, image): Observable<any[]> {
        return this.http.get<any[]>(`${this.moderation}` + 'video-moderation/' + id + '/' + image);
    }
    videoResult(id): Observable<any[]> {
        return this.http.get<any[]>(`${this.moderation}` + 'video-moderation-result/' + id);
    }

    getLoggedUserDetail() {
        const token = localStorage.getItem('access_token');

        // decode the token to get its payload
        return token ? jwt_decode(token) : null;
    }

    // async onUploadMedia(files) {
    //     console.log('files=>', files);

    //     this.allImages = [];
    //     return new Promise((pass, fail) => {
    //         let cnt = 0;

    //         this.bucketName = 'mishow-profile-store';



    //         this.commonservice.getAllBuckets().subscribe(res => { });

    //         this.commonservice.getPresignURL('upload', this.bucketName, this.userDetail.sub, files.name).subscribe((data: any) => {


    //             let formData: FormData = new FormData();
    //             formData.append('key', data.url.fields.key);
    //             formData.append('x-amz-algorithm', data.url.fields['x-amz-algorithm']);
    //             formData.append('x-amz-credential', data.url.fields['x-amz-credential']);
    //             formData.append('x-amz-date', data.url.fields['x-amz-date']);
    //             formData.append('x-amz-security-token', data.url.fields['x-amz-security-token']);
    //             formData.append('policy', data.url.fields.policy);
    //             formData.append('x-amz-signature', data.url.fields['x-amz-signature']);

    //             formData.append('x-amz-server-side-encryption', 'AES256');
    //             formData.append('Content-Type', files.type);

    //             formData.append('file', files, files.name);

    //             if (localStorage.getItem('id_token') !== null) {
    //                 this.token = localStorage.getItem('id_token')
    //                 localStorage.setItem('token', this.token);
    //                 localStorage.removeItem('id_token');
    //             }


    //             let url = this.bucketName + '?file-name=' + this.userDetail.sub + '/' + files.name;
    //             this.http.post(data.url.url, formData).subscribe(res => {

    //                 localStorage.setItem('id_token', localStorage.getItem('token'));
    //                 this.allImages.push(url);

    //                 pass(this.allImages);


    //             }, err => {
    //                 fail(err)
    //                 localStorage.setItem('id_token', localStorage.getItem('token'));
    //             });

    //         }, err => {
    //             fail(err)
    //         });
    //         cnt++;




    //     })
    // }

    dateFilter(date) {
        const dt1 = date.split('-');
        const dt2 = dt1[1] + '/' + dt1[2] + '/' + dt1[0];
        const dt3 = moment(dt2, 'MM/DD/YYYY').format('MM/DD/YYYY');
        return dt3;
    }

    scheduleDate(date) {

        let dt = date.split('-');
        let dt1 = dt[0] + '-' + dt[1] + '-' + dt[2];
        return dt1;
    }

    scheduleTime(date) {
        let dt = date.split('-');
        let dt2 = moment(dt[3], 'hh:mm:ss').format('kk:mm:ss');
        return dt2;
    }


    // privacy settings
    get_privacy(): Observable<any[]> {
        return this.http.get<any[]>(`${this.Setting_url}` + '/privacy');
    }

    update_privacy(data): Observable<any[]> {
        return this.http.put<any[]>(`${this.Setting_url}` + '/privacy', data);
    }

    get_privacy_all(userid): Observable<any[]> {
        return this.http.get<any[]>(`${this.Setting_url}` + '/privacy?user_id=' + userid);
    }

    // creator notification Setting
    get_notification(): Observable<any[]> {
        return this.http.get<any[]>(`${this.Setting_url}` + '/creator-notifications');
    }

    update_notification(data): Observable<any[]> {
        return this.http.put<any[]>(`${this.Setting_url}` + '/creator-notifications', data);
    }

    // partner agreement
    add_agreement(data): Observable<any[]> {
        return this.http.post<any[]>(`${this.partnerURL}` + 'partner-agreement', data);
    }

    get_agreement(): Observable<any[]> {
        return this.http.get<any[]>(`${this.partnerURL}` + 'partner-agreement');
    }
    edit_agreement(data): Observable<any[]> {
        return this.http.put<any[]>(`${this.partnerURL}` + 'partner-agreement', data);
    }

    get_agreement_all(userId): Observable<any[]> {
        return this.http.get<any[]>(`${this.partnerURL}` + 'partner-agreement?user_id=' + userId);
    }

    // release agreement
    add_release_agreement(data): Observable<any[]> {
        return this.http.post<any[]>(`${this.releaseURL}` + 'release-agreement', data);
    }

    get_release_agreement(): Observable<any[]> {
        return this.http.get<any[]>(`${this.releaseURL}` + 'release-agreement');
    }
    edit_release_agreement(data): Observable<any[]> {
        return this.http.put<any[]>(`${this.releaseURL}` + 'release-agreement', data);
    }

    // payment

    cardDeatil(data): Observable<any[]> {
        return this.http.post<any[]>(`${this.payment}` + '/pay', data);
    }

    addCard(data): Observable<any[]> {
        return this.http.post<any[]>(`${this.payment}` + '/create-profile', data);
    }

    addNewDetails(data): Observable<any[]> {
        return this.http.post<any[]>(`${this.payment}` + '/new-payment-profile', data);
    }
    addnewShippingDetail(data): Observable<any[]> {
        return this.http.post<any[]>(`${this.payment}` + '/new-shipping-profile', data);
    }

    deleteCard(data): Observable<any[]> {
        return this.http.delete<any[]>(`${this.payment}` + '/delete-card/' + data);
    }

    getCardDetail(): Observable<any[]> {
        return this.http.get<any[]>(`${this.payment}` + '/get-customer-profile');
    }

    getPurchase(id, skip, limit): Observable<any[]> {
        return this.http.get<any[]>(`${this.payment}` + '/list-transactions?user_id=' + id + '&skip=' + skip + '&limit=' + limit);
    }

    getPayments(id, skip, limit): Observable<any[]> {
        return this.http.get<any[]>(`${this.payment}` + '/list-transactions?user_id=' + id + '&purchaser=false' + '&skip=' + skip + '&limit=' + limit);
    }

    addNoteToPayment(transactionID, note): Observable<any[]> {
        return this.http.post<any[]>(`${this.payment}` + '/notes/' + transactionID, note);
    }


    addTaxes(id, state, type, price, data): Observable<any[]> {
        return this.http.post<any[]>(`${this.taxesURL}` + id + '/' + state + '/' + type + '/' + price, data);
    }


    // subscriber notification setting
    get_subscriber_notification(): Observable<any[]> {
        return this.http.get<any[]>(`${this.Setting_url}` + '/subscriber-notifications');
    }

    update_subscriber_notification(data): Observable<any[]> {
        return this.http.put<any[]>(`${this.Setting_url}` + '/subscriber-notifications', data);
    }

    // subscription Setting

    get_subscription(): Observable<any[]> {
        return this.http.get<any[]>(`${this.Setting_url}` + '/subscriptions');
    }

    update_subscription(data): Observable<any[]> {
        return this.http.put<any[]>(`${this.Setting_url}` + '/subscriptions', data);
    }

    get_subscribe(id): Observable<any[]> {
        return this.http.get<any[]>(`${this.Setting_url}` + '/subscriptions/getTiers/' + id);
    }

    // post
    add_post(data): Observable<any[]> {
        return this.http.post<any[]>(`${this.posturl}`, data);
    }
    get_post(): Observable<any[]> {
        return this.http.get<any[]>(`${this.posturl}`);
    }
    get_post_id(id): Observable<any[]> {
        return this.http.get<any[]>(`${this.posturl}` + '/' + id);
    }
    modify_post(data): Observable<any[]> {
        return this.http.put<any[]>(`${this.posturl}`, data);
    }

    delete_post(id): Observable<any[]> {
        return this.http.delete<any[]>(`${this.posturl}` + '/delete/' + id);
    }

    get_comments_post(data, skip, limit): Observable<any[]> {
        return this.http.get<any[]>(`${this.commentURL}` + '/comments/' + data + '/' + skip + '/' + limit);
    }

    get_votes_post(data): Observable<any[]> {
        return this.http.get<any[]>(`${this.voteURL}` + '/post/vote/' + data);
    }

    getAllVotes(data): Observable<any[]> {
        return this.http.get<any[]>(`${this.voteURL}` + '/post/getvotes/' + data);
    }

    update_media(id: string, data: string) {
        return this.http.put(`${this.posturl}/media/` + id + '?media_file=' + data, { media_file: data });
    }
    remove_media(id: string, data: string) {
        return this.http.delete(`${this.posturl}/media/` + id + '?media_file=' + data);
    }

    // post

    // comments

    comment(data): Observable<any[]> {
        return this.http.post<any[]>(`${this.commentURL}` + '/comments/', data);
    }

    delete_comments(data, skip, list): Observable<any[]> {
        return this.http.delete<any[]>(`${this.commentURL}` + '/comments/' + data + '/' + skip + '/' + list);
    }

    update_comment(data): Observable<any[]> {
        return this.http.put<any[]>(`${this.commentURL}` + '/comments', data);
    }

    like_comment(data): Observable<any[]> {
        return this.http.get<any[]>(`${this.commentURL}` + '/comments/react/like/' + data);
    }
    unlike_comment(data): Observable<any[]> {
        return this.http.get<any[]>(`${this.commentURL}` + '/comments/react/unlike/' + data);
    }

    tip_comment(postID, commnetID, transectionID): Observable<any[]> {
        return this.http.put<any[]>(`${this.commentURL}` + '/comments/pay/' + postID + '/' + commnetID + '/' + transectionID, { postID, commnetID, transectionID });
    }

    reply_comment(commnetID, data): Observable<any[]> {
        return this.http.post<any[]>(`${this.commentURL}` + '/comments/replay/' + commnetID, data);
    }
    get_reply(data, skip, list): Observable<any[]> {
        return this.http.get<any[]>(`${this.commentURL}` + '/comments/getreplays/' + data + '/' + skip + '/' + list);
    }
    delete_reply(commentID, replayID): Observable<any[]> {
        return this.http.delete<any[]>(`${this.commentURL}` + '/comments/replay/' + commentID + '/' + replayID);
    }
    // comments


    // pack
    add_pack(data): Observable<any[]> {
        return this.http.post<any[]>(`${this.packurl}`, data);
    }

    get_pack(): Observable<any[]> {
        return this.http.get<any[]>(`${this.packurl}`);
    }

    get_pack_id(id): Observable<any[]> {
        return this.http.get<any[]>(`${this.packurl}` + '/' + id);
    } replayID

    modify_pack(data): Observable<any[]> {
        return this.http.put<any[]>(`${this.packurl}`, data);
    }
    delete_pack(id): Observable<any[]> {
        return this.http.delete<any[]>(`${this.packurl}` + '/' + id);
    }

    update_media_pack(id: string, data: string) {
        return this.http.put(`${this.packurl}/media/` + id + '?media_file=' + data, { media_file: data });
    }
    remove_media_pack(id: string, data: string) {
        return this.http.delete(`${this.packurl}/media/` + id + '?media_file=' + data);
    }

    // pack

    // product
    add_product(data): Observable<any[]> {
        return this.http.post<any[]>(`${this.producturl}`, data);
    }

    get_product(): Observable<any[]> {
        return this.http.get<any[]>(`${this.producturl}`);
    }

    get_product_id(id): Observable<any[]> {
        return this.http.get<any[]>(`${this.producturl}` + '/' + id);
    }

    modify_product(data): Observable<any[]> {
        return this.http.put<any[]>(`${this.producturl}`, data);
    }

    delete_product(id): Observable<any[]> {
        return this.http.delete<any[]>(`${this.producturl}` + '/' + id);
    }
    update_media_product(id: string, data: string) {
        return this.http.put(`${this.producturl}/media/add/` + id + '?media_file=' + data, { product_image: data });
    }
    remove_media_product(id: string, data: string) {
        return this.http.delete(`${this.producturl}/media/remove/` + id + '?media_file=' + data);
    }

    modifyQty(id, qty): Observable<any[]> {
        return this.http.get<any[]>(`${this.producturl}` + '/purchase/' + id + '/' + qty);
    }

    // exclusive

    add_exclusive(data): Observable<any[]> {
        return this.http.post<any[]>(`${this.exclusiveurl}`, data);
    }

    get_exclusive(): Observable<any[]> {
        return this.http.get<any[]>(`${this.exclusiveurl}`);
    }
    get_exclusive_id(id): Observable<any[]> {
        return this.http.get<any[]>(`${this.exclusiveurl}` + '?id=' + id);
    }

    modify_exclusive(data): Observable<any[]> {
        return this.http.put<any[]>(`${this.exclusiveurl}`, data);
    }

    update_media_exclusive(id: string, data: string) {
        return this.http.put(`${this.exclusiveurl}/media/add/` + id + '?media_file=' + data, { media: data });
    }
    remove_media_exclusive(id: string, data: string) {
        return this.http.delete(`${this.exclusiveurl}/media/remove/` + id + '?media_file=' + data);
    }
    contribute(data): Observable<any[]> {
        return this.http.post<any[]>(`${this.exclusiveurl}/contribute`, data);
    }
    delete_exclusive(id): Observable<any[]> {
        return this.http.delete<any[]>(`${this.exclusiveurl}` + '/' + id);
    }

    update_content(operation, exclusive_id, url): Observable<any[]> {
        return this.http.put<any[]>(`${this.exclusiveurl}` + '/content/' + operation + '/' + exclusive_id + '?media_file=' + url, { url });
    }

    // exclusive

    // chat

    chat_access_token(identity): Observable<any[]> {
        return this.http.get<any[]>(`${this.chatURL}` + '/accesstoken/' + identity);
    }
    create_user(uuid, name): Observable<any[]> {
        return this.http.post<any[]>(`${this.chatURL}` + '/createUser/' + uuid + '/' + name, { uuid, name });
    }
    get_all_users(): Observable<any[]> {
        return this.http.get<any[]>(`${this.chatURL}` + '/fetchUser');
    }

    get_all_channel(user_id): Observable<any[]> {
        return this.http.get<any[]>(`${this.chatURL}` + '/fetch-channels-for-user/' + user_id);
    }

    // chat


    // category
    get_all_category(): Observable<any[]> {
        return this.http.get<any[]>(`${this.categoryURL}`);
    }

    update_creator_category(data): Observable<any[]> {
        return this.http.put<any[]>(`${this.categoryURL}`, data);
    }
    // category

    // tags
    getTags(id): Observable<any[]> {
        return this.http.get<any[]>(`${this.tagsURL}` + '/' + id);
    }

    // user logs

    user_log(data): Observable<any[]> {
        return this.http.post<any[]>(`${this.logs}`, data);
    }


    // hotlinks

    get_hotlink(postid, bucket, file): Observable<any[]> {
        return this.http.get<any[]>(`${this.hotlinkURL}` + '/' + postid + '/' + bucket + '/' + file);
    }

    // notification
    creator_notification(data): Observable<any[]> {
        return this.http.post<any[]>(`${this.notificationURL}` + 'creator-notification/creator', data);
    }

    Subscriber_notification(data): Observable<any[]> {
        return this.http.post<any[]>(`${this.notificationURL}` + 'subscriber-notification/subscriber', data);
    }


    allNotifications(): Observable<any[]> {
        return this.http.get<any[]>(`${this.offlineNotificationURL}`);
    }

    allNotificationsfilter(event): Observable<any[]> {
        return this.http.get<any[]>(`${this.offlineNotificationURL}` + '?event_type=' + event);
    }

    viewedNotification(uuid): Observable<any[]> {
        return this.http.put<any[]>(`${this.offlineNotificationURL}` + '/view', uuid);
    }

    liveCreatorNotification() {
        return this
            .http
            .get(
                `${this.liveNotification}creator-notifications?Action=ReceiveMessage&WaitTimeSeconds=10&MaxNumberOfMessages=5&VisibilityTimeout=30`)
            .toPromise();
    }

    liveSubscriberNotification() {
        return this.http.get(`${this.liveNotification}subscriber-notification?Action=ReceiveMessage&WaitTimeSeconds=10&MaxNumberOfMessages=5&VisibilityTimeout=30`).toPromise();
    }
    liveNotificationView(obj): Observable<any[]> {
        return this.http.put<any[]>(`${this.liveNotification}` + 'notification/view', obj);
    }


    // quick question

    quickQuestion(obj): Observable<any[]> {
        return this.http.post<any[]>(`${this.quickQuastionURL}`, obj);
    }

    // quick question

    // feed

    getFeedPost(skip, limit): Observable<any[]> {
        return this.http.get<any[]>(`${this.feedURL}` + '/post' + '?skip=' + skip + '&limit=' + limit);
    }


    getFeedPack(skip, limit): Observable<any[]> {
        return this.http.get<any[]>(`${this.feedURL}` + '/pack' + '?skip=' + skip + '&limit=' + limit);
    }

    getFeedProduct(skip, limit): Observable<any[]> {
        return this.http.get<any[]>(`${this.feedURL}` + '/product' + '?skip=' + skip + '&limit=' + limit);
    }

    getFeedExclusive(skip, limit): Observable<any[]> {
        return this.http.get<any[]>(`${this.feedURL}` + '/exclusive' + '?skip=' + skip + '&limit=' + limit);
    }

    getInterrestedFeed(): Observable<any[]> {
        return this.http.get<any[]>(`${this.feedURL}` + '/interest');
    }


    //feed

    // get user detail
    // getLoggedUserDetail() {
    //     let userDetails;
    //     const token = localStorage.getItem('token');

    //     // decode the token to get its payload
    //     userDetails = jwt_decode(token);
    //     return userDetails;
    // }

    // async encrypt(message: any) {
    //     return AES.encrypt(message, this.secretKey).toString();
    // }

    // async decrypt(ciphertext: any) {
    //     return AES.decrypt(ciphertext.toString(), this.secretKey).toString(enc.Utf8);
    // }



}

interface INotification {
    uuid: string;
    ReceiptHandle: string;
};

