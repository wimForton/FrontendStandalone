import { Component, OnInit, ViewChild, ElementRef, NgZone, Input, HostListener, OnDestroy } from '@angular/core';
import * as PIXI from 'pixi.js';
import { Application } from 'pixi.js';
import { MidiTrack } from 'src/app/api/_models/midiTrack';
import { Midi } from '@tonejs/midi';
import * as Tone from "Tone";
//remove this comment
class note{ 
  time: number = 0;
  note: string = "";
  velocity: number = 0;
  }

@Component({
  selector: 'app-pixiapp',
  standalone: true,
  imports: [],
  templateUrl: './pixiapp.component.html',
  styleUrl: './pixiapp.component.css'
})
export class PixiappComponent implements OnInit {

  public app!: Application;
  private cursor: PIXI.Graphics = new PIXI.Graphics();
  private notetracks: Array<Array<note>> = new Array<Array<note>>();
  private noteContainer: PIXI.Container = new PIXI.Container();
  private part!: Tone.Part;


  @Input() midistream!: Midi;

  @ViewChild('container')
  container!: ElementRef;

  @Input()
  public devicePixelRatio = window.devicePixelRatio || 1;


  constructor(private elementRef: ElementRef, private ngZone: NgZone) {}

  init() {
    //console.log("midiId", this.midiId);
    this.ngZone.runOutsideAngular(() => {
      this.app = new Application({background: new PIXI.Color('rgb(10, 15, 25, 1)').toArray()});
    });
    this.elementRef.nativeElement.appendChild(this.app.view);
    //document.getElementById('pixidiv').appendChild(this.app.view);
    this.resize();
  }

  ngOnInit(): void {
    this.init();
    this.createCursor();
    this.placeNotes();

    // Listen for animate update
    this.app.ticker.add((delta) =>
    {
        // just for fun, let's rotate mr rabbit a little
        // delta is 1 if running at 100% performance
        // creates frame-independent transformation
        this.noteContainer.x = Tone.Transport.seconds * -20;//this.part.progress//Tone.now();
    });
  }
  createCursor() {
    this.cursor = new PIXI.Graphics();
    this.cursor.beginFill(new PIXI.Color('rgb(20, 150, 255, 1)').toArray());
    this.cursor.drawRect(0, 0, 2,600);
    this.cursor.endFill();
    this.app.stage.addChild(this.cursor);
  }
  placeNotes(){
    this.midistream.tracks.forEach(track => {
      const notes = track.notes

      notes.forEach(note => {
          let graphic: PIXI.Graphics = new PIXI.Graphics();
          graphic.beginFill(new PIXI.Color('rgb(255, 150, 0, 1)').toArray());
          graphic.drawRect(note.time * 20, 450 - (note.midi * 4), Math.max(note.duration*8,3),3);
          graphic.endFill();
          this.noteContainer.addChild(graphic)
          //console.log(note.name, note.midi, note.time, note.duration);
        //note.midi, note.time, note.duration, note.name
      })
      
      let noteArray = new Array<note>();
      notes.forEach(note => {
        let onenote: note = {time: note.time, note: note.name, velocity: note.velocity};
        noteArray.push(onenote);
      })
      this.notetracks.push(noteArray);
    });
    this.app.stage.addChild(this.noteContainer);
    const synth = new Tone.PolySynth(Tone.FMSynth, {
      envelope: {
          attack: 0.02,
          decay: 0.1,
          sustain: 0.8,
          release: 0.8,
      },
    }).toDestination();
    // use an array of objects as long as the object has a "time" attribute
    this.part = new Tone.Part(((time, value) => {
    // the value is an object which contains both the note and the velocity
    synth.triggerAttackRelease(value.note, "8n", time, value.velocity);
    }), this.notetracks[0]).start(0);
  }

  play(){

    Tone.Transport.start();
  }

  stop(){
    Tone.Transport.stop();
  }

  @HostListener('window:resize')
  public resize() {
    const myPixidiv = document.getElementById('pixidiv');
    let width = this.elementRef.nativeElement.offsetWidth;//Math.min(this.elementRef.nativeElement.offsetWidth, 1100);
    
    // if(myPixidiv){
    //   width = myPixidiv.getBoundingClientRect().width * 0.9; // Get the width of the your element
    // }
    console.log("width----------------",width);
    const height = 400;//this.elementRef.nativeElement.offsetHeight;
    const viewportScale = 1 / this.devicePixelRatio;
    this.app.renderer.resize(width * this.devicePixelRatio, height * this.devicePixelRatio);
    //this.app.view.style.transform = `scale(${viewportScale})`;
    //this.app.view.style.transformOrigin = `top left`;
  }

  destroy() {
    this.app.destroy();
    Tone.Transport.stop();
    this.part.clear();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

}
