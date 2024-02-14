import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Midi } from '@tonejs/midi';
import * as Tone from "Tone";
import { MidiTrack } from 'src/app/api/_models/midiTrack';
import { FileTransferService } from 'src/app/api/_services/filetransfer.service';
import { GetmididetailsService } from 'src/app/api/_services/getmididetails.service';
import { PixiappComponent } from '../pixijs/pixiapp/pixiapp.component';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-mididetail',
  templateUrl: './mididetail.component.html',
  styleUrl: './mididetail.component.css',
  standalone: true,
  imports: [PixiappComponent, NgIf, NgFor]
})
export class MididetailComponent implements OnInit {

  public Id: number = 1;
  public miditrack!: MidiTrack;
  public midistream!: Midi;
  private synths!: Array<Tone.PolySynth>;

  constructor(private route: ActivatedRoute, private getmididetailsService: GetmididetailsService, private transferService: FileTransferService) {}
  ngOnInit(): void {
    this.setProporties();
    this.getmiditrack();
    
  }
  setProporties(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.Id = id;
    console.log("this.Id", this.Id);
  }
  getmiditrack(){
    this.getmididetailsService.getmididetails(this.Id)
    .subscribe(
      (response: MidiTrack) =>{
          if (response) {
            this.miditrack = response;
            this.download();
          }
      }
    )
  }
  download = () => {
    let filePath: string = this.miditrack.filePath;
    this.transferService.download(filePath)
    .subscribe(
        (response: ArrayBuffer) =>{
            if (response) {
            console.log("arrayBuffer", response);
            const midi = new Midi(response);
            this.midistream = new Midi(response);
            midi.tracks.forEach(track => {
                const notes = track.notes
                notes.forEach(note => {
                    //console.log(note.name);
                  //note.midi, note.time, note.duration, note.name
                })
              })
            // byteArray.forEach((element, index) => {
            //     // do something with each byte in the array
            // });
            }
        }
    )
  }

  play(){

    this.synths = [];
    const now = Tone.now() + 0.5;
    this.midistream.tracks.forEach((track) => {
        //create a synth for each track
        const synth = new Tone.PolySynth(Tone.Synth, {
            envelope: {
                attack: 0.02,
                decay: 0.1,
                sustain: 0.3,
                release: 0.8,
            },
        }).toDestination();
        synth.volume.value = 0.3;
        this.synths.push(synth);
        //schedule all of the events
        track.notes.forEach((note) => {
            synth.triggerAttackRelease(
                note.name,
                note.duration,
                note.time + now,
                note.velocity
            );
        });
    });
  }
  stop(){

    this.synths.forEach(synth => {
      synth.dispose();

    });

    this.synths = [];
  }

}
