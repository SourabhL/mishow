import { Component, OnInit } from '@angular/core';
import { saveAs, encodeBase64 } from '@progress/kendo-file-saver';
import * as JSZip from 'jszip';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-view-download-pack',
  templateUrl: './view-download-pack.component.html',
  styleUrls: ['./view-download-pack.component.css']
})
export class ViewDownloadPackComponent implements OnInit {
  images: any[];
  imagearray: any[];
  var1: any[];
  media: any = [];
  data: any = [];
  packTitle: any;
  packDescription: any;
  modalRef: BsModalRef;
  mediaImages: any = [];
  profile: any = [];
  constructor(
    private route: ActivatedRoute,
    private commonservice: CommonService,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService

  ) {

    this.spinner.show();
    this.commonservice.get_pack_id(this.route.snapshot.params.id).subscribe((res: any) => {
      this.data = res;
      this.commonservice.getProfile_by_id(res.creator_id).subscribe((res: any) => {
        this.profile = res;
      })

      this.media = {
        image: [],
        video: []
      };
      const isImages = ['jpg', 'jpeg', 'png', 'webp'];
      const isVideo = ['mp4'];

      this.data.preview_media.forEach(e => {
        const imgStr = isImages.join(',');
        const videoStr = isVideo.join(',');
        if (imgStr.includes(e.split('.').pop()) === true) {
          this.media.image.push(e);
        } else {
          this.media.video.push(e);
        }
      });
      this.spinner.hide();
    });

    this.images = [];


  }

  ngOnInit() {
  }

  getFileData = (file, name) => {
    return new Promise((resolve, reject) => {
      fetch(file).then(res => res.blob()).then(blob => {
        console.log('blob=>', blob);
        this.getBase64(blob)
          .then((b64: any) => {
            resolve({ b64, name });
          })
          .catch(err => reject(err)
          );
      });
    });
  }


  open(temp, arr) {
    this.modalRef = this.modalService.show(temp, { class: 'MediaPopup modal-lg' });
    this.mediaImages = arr;
  }

  downloadFileExample() {

    // const jszip = new JSZip();
    // const content = jszip.folder('content');
    // const IMGs = Promise.all(this.images
    //   .map(img => this.getFileData(`${window.location.origin}/${img.source}`, img.source)));


    // IMGs.then((imgs: any) => {
    //   imgs.map((img: any) => content.file(
    //     img.name.split('/').pop(),
    //     img.b64.split('base64,').pop(),
    //     { base64: true }));
    // jszip.generateAsync({ type: 'blob' }).then((cnt) => {
    // see FileSaver.js
    saveAs(this.data.pack_media, this.data.title + '.zip');
    // });
    // });

  }
  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        console.log('Error: ', error);
        reject(error);
      };
      reader.readAsDataURL(file);
    });

  }

}
