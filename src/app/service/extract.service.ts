import { Injectable } from '@angular/core';
import * as extract from 'extract-zip';
@Injectable({
  providedIn: 'root'
})
export class ExtractService {

  constructor() {

  }

  async extract(source, target) {
    try {
      await extract(source, { dir: target });
      console.log('Extraction complete');
    } catch (err) {
      // handle any errors
    }
  }
}
