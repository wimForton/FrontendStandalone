import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpErrorResponse } from '@angular/common/http';
//import * as midiManager from 'midi-file';

@Injectable({
  providedIn: 'root'
})
export class FileTransferService {
  private url: string = 'https://localhost:44356/api/DownloadUpload';
  constructor(private http: HttpClient) { }

  public upload(formData: FormData) {
    console.log(this.url + '/upload/' + formData);
    return this.http.post(this.url + '/upload/', formData, {
        reportProgress: true,
        observe: 'events',
    });
  }

  public download(filePath: string) {
    var testUrl3: string = this.url + "/download?fileUrl=MidiData\\maestro\\" + filePath;
    console.log("testUrl", testUrl3);
    return this.http.get(testUrl3, {responseType: 'arraybuffer'});
  }
  public downloadArrayBufferUrl(url: string) {
    console.log("downloadbyurl", url);
    return this.http.get(url, {responseType: 'arraybuffer'});
  }
}
