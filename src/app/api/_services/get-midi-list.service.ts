import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { MidiTrack } from '../_models/midiTrack';

@Injectable({
  providedIn: 'root'
})
export class GetMidiListService {
  public currentpage: number = 1;

  public midifiles: MidiTrack[] = [];
  private rootPath: string = 'https://localhost:44356/';
  constructor(private http: HttpClient) { }

  public getlist() {
    return this.http.get<MidiTrack[]>(this.rootPath + 'api/MidiDataApi/getall');
  }

  public getlistpage(pagenumber: number, itemsperpage: number) {
    this.currentpage = pagenumber;
    let path = this.rootPath + 'api/MidiDataApi/getpage' 
    + '?pagenum=' + pagenumber 
    + '&itemsPerPage=' + itemsperpage;
    console.log("path", path);
    return this.http.get<MidiTrack[]>(path);
  }
}
