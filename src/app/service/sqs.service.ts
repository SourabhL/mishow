

import { Injectable } from '@angular/core';
// import * as AWS from 'aws-sdk/global';
import * as AWS from 'aws-sdk';
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

export class SQSService {
    constructor() {
        // Set the region
        AWS.config.update({ region: 'us-east-2' });
    }

    getQueueMessage(url: string) {
        const queueURL = url;

        const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

        const params = {
            AttributeNames: [
                'SentTimestamp'
            ],
            MaxNumberOfMessages: 10,
            MessageAttributeNames: [
                'All'
            ],
            QueueUrl: queueURL,
            VisibilityTimeout: 20,
            WaitTimeSeconds: 0
        };

        sqs.receiveMessage(params, (err, data) => {
            if (err) {
                console.log('Receive Error', err);
            } else if (data.Messages) {
                // const deleteParams = {
                //     QueueUrl: queueURL,
                //     ReceiptHandle: data.Messages[0].ReceiptHandle
                // };
                // sqs.deleteMessage(deleteParams, (e, d) => {
                //     if (e) {
                //         console.log('Delete Error', environment);
                //     } else {
                //         console.log('Message Deleted', d);
                //     }
                // });
            }
        });
    }
}
