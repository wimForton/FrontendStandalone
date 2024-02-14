import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MidiListComponent } from './gui/midi-list/midi-list.component';
import { UploadComponent } from './api/upload/upload.component';
import { DownloadComponent } from './api/download/download.component';
import { RouterModule } from '@angular/router';
import { PixiappComponent } from './gui/pixijs/pixiapp/pixiapp.component';



@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    standalone: true,
    imports: [MidiListComponent, UploadComponent, DownloadComponent, RouterModule, PixiappComponent]
})
export class AppComponent{


  title = 'FrontendANG';
}
