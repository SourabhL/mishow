import { Injectable } from '@angular/core';
// import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
@Injectable({
    providedIn: 'root'
})
class ResponseData {
    data: string;
    isSuccess: boolean;
    errorMsg: string;
}

export class UploadS3Service {
    private FOLDER: any;
    constructor() { }

    uploadFile(file: File, folder: string) {
        const promise = new Promise((resolve, reject) => {
            const res = new ResponseData();
            const contentType = file.type;
            this.FOLDER = folder + '/';
            const bucket = new S3(
                {
                    accessKeyId: environment.ACCESS_KEY_ID,
                    secretAccessKey: environment.SECRET_ACCESS_KEY,
                    region: 'us-east-1'
                }
            );
            const params = {
                Bucket: 'mishow-bucket',
                Key: this.FOLDER + moment().unix() + '_' + file.name,
                Body: file,
                ACL: 'public-read',
                ContentType: contentType
            };
            bucket.upload(params, (err, data) => {
                if (err) {
                    console.log('There was an error uploading your file: ', err);
                    // return false;
                    res.isSuccess = false;
                    res.errorMsg = err;
                    res.data = '';
                    reject(res);
                } else {

                    console.log('Successfully uploaded file.');
                    res.isSuccess = true;
                    res.errorMsg = '';
                    res.data = data;
                    resolve(res);
                    // return true;
                }
            });
            // return res;
            // for upload progress
            /*bucket.upload(params).on('httpUploadProgress', function (evt) {
                      console.log(evt.loaded + ' of ' + evt.total + ' Bytes');
                  }).send(function (err, data) {
                      if (err) {
                          console.log('There was an error uploading your file: ', err);
                          return false;
                      }
                      console.log('Successfully uploaded file.', data);
                      return true;
                  });*/
        });
        return promise;
    }

    deleteFile(filename: string) {
        const promise = new Promise((resolve, reject) => {

            const res = new ResponseData();
            // this.FOLDER = encodeURIComponent(folder) + '/';

            const bucket = new S3(
                {
                    accessKeyId: environment.ACCESS_KEY_ID,
                    secretAccessKey: environment.SECRET_ACCESS_KEY,
                    region: 'us-east-1'
                }
            );

            const params = {
                Bucket: 'mishow-bucket',
                Key: filename,
            };

            bucket.deleteObject(params, (err, data) => {
                if (err) {
                    console.log('There was an error uploading your file: ', err);
                    // return false;
                    res.isSuccess = false;
                    res.errorMsg = 'There was an error uploading your file';
                    res.data = '';
                    reject(res);
                } else {
                    console.log('Successfully Deleted file.');
                    // return true;
                    res.isSuccess = true;
                    res.errorMsg = '';
                    res.data = 'Successfully Deleted file.';
                    resolve(res);
                }
            });

        });
        return promise;
    }

    uploadZip(file: Blob, name: String, folder: string) {
        const promise = new Promise((resolve, reject) => {
            const res = new ResponseData();
            const contentType = file.type;
            this.FOLDER = folder + '/';
            const bucket = new S3(
                {
                    accessKeyId: environment.ACCESS_KEY_ID,
                    secretAccessKey: environment.SECRET_ACCESS_KEY,
                    region: 'us-east-1'
                }
            );
            const params = {
                Bucket: 'mishow-bucket',
                Key: this.FOLDER + moment().unix() + '_' + name,
                Body: file,
                ACL: 'public-read',
                ContentType: contentType
            };
            bucket.upload(params, (err, data) => {
                if (err) {
                    console.log('There was an error uploading your file: ', err);
                    // return false;
                    res.isSuccess = false;
                    res.errorMsg = err;
                    res.data = '';
                    reject(res);
                } else {

                    console.log('Successfully uploaded Zip.');
                    res.isSuccess = true;
                    res.errorMsg = '';
                    res.data = data;
                    resolve(res);
                    // return true;
                }
            });
            // return res;
            // for upload progress
            /*bucket.upload(params).on('httpUploadProgress', function (evt) {
                      console.log(evt.loaded + ' of ' + evt.total + ' Bytes');
                  }).send(function (err, data) {
                      if (err) {
                          console.log('There was an error uploading your file: ', err);
                          return false;
                      }
                      console.log('Successfully uploaded file.', data);
                      return true;
                  });*/
        });
        return promise;
    }



}

