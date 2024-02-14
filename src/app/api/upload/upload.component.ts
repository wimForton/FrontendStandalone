import { HttpClient, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FileTransferService } from '../_services/filetransfer.service';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrl: './upload.component.css',
    standalone: true,
    imports: [NgIf, FormsModule]
})
export class UploadComponent implements OnInit {
  progress: number = 0;
  message?: string;
  composer: string = "";
  year: number = 2024;
  title: string = "";
  @Output() public onUploadFinished = new EventEmitter();
  
  constructor(private transferService: FileTransferService) { }
  ngOnInit() {
  }
  uploadFile = (files: FileList | null) => {
    if (files == null || files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    
    this.transferService.upload(formData)
      .subscribe({
        next: (event) => {
        if (event.type === HttpEventType.UploadProgress){
          if (event.total != undefined){
            this.progress = Math.round(100 * event.loaded / event.total);
          }
        }
        else if (event.type === HttpEventType.Response) {
          this.message = 'Upload success.';
          this.onUploadFinished.emit(event.body);
        }
      },
      error: (err: HttpErrorResponse) => console.log(err)
    });
  }
}
