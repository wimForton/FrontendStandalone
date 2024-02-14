import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { MidiTrack } from '../_models/midiTrack';

@Injectable({
  providedIn: 'root'
})
export class GetmididetailsService {

  private rootPath: string = 'https://localhost:44356/';

  constructor(private http: HttpClient) { }
  public getmididetails(id: number) {
    return this.http.get<MidiTrack>(this.rootPath + 'api/MidiDataApi/findbyid' + id);
  }
}
