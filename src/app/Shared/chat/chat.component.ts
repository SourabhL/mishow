import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';
// import { Client, PushNotification, User } from 'twilio-chat';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  accessToken: string;
  uuid;
  name;
  id;
  subscribers;
  client: any;
  channels: any = [];
  constructor(private commonservice: CommonService) {

    this.commonservice.get_profile().subscribe(async (res: any) => {
      this.uuid = res.user_id;
      this.name = res.profile_url;
      this.commonservice.chat_access_token(this.name).subscribe((token: any) => {
        console.log(res);
        this.accessToken = token.access_token;
        this.commonservice.get_all_users().subscribe(users => {
          console.log('users=>', users);

        })
        // Client.create(token.access_token)
        //   .then((client: any) => {
        //     // client.createChannel({
        //     //   uniqueName: 'Nishi0203',
        //     //   friendlyName: 'Test Channell',
        //     // })
        //     //   .then((channel) => {
        //     //     console.log('Created general channel:');
        //     //     console.log(channel);
        //     //   });
        //     console.log('client=>', client);

        //     client.on('channelJoined', (channels) => {
        //       console.log('Joined channel ' + channels.friendlyName);
        //       channels.join().catch((err) => {
        //         console.error(
        //           "Couldn't join channel " + channels.friendlyName + ' because ' + err
        //         );
        //       });
        //     });


        // })


        // this.client = client;


        // client.getPublicChannelDescriptors().then((channels) => {

        //   console.log({ channels, items: channels.items });
        //   channels.items.forEach(e => {
        //     this.channels.push(e);

        //     e['channel'].getMessages(25)
        //       .then(function (messages) {
        //         for (let i = 0; i < messages.length; i++) {
        //           var message = messages[i];
        //           console.log('Message: ' + message.body);
        //         }
        //       });
        //   });
        //   console.log('this.channels=>', this.channels);
        // message
        // channels.getMessages().then((messages) => {
        //   console.log('messages=>', messages);

        //   const totalMessages = messages.items.length;
        //   for (let i = 0; i < totalMessages; i++) {
        //     const message = messages.items[i];
        //     console.log('Author:' + message.author);
        //   }
        //   console.log('Total Messages:' + totalMessages);
        //   // });
        // })


        // .catch(err => console.log({ err }));

      });

    });


  }

  fetchAccessToken() {

  }

  ngOnInit() {
    // token fetch
    this.fetchAccessToken();
  }

}