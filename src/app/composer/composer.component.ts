import {Component, OnInit} from '@angular/core';
import {ScaleType} from '@tonaljs/scale-type'
import {Scale, ScaleDictionary, Note, Interval, Chord} from '@tonaljs/tonal';

function sortByTypeAndName(a: ScaleType, b: ScaleType): number {
  return a.name.localeCompare(b.name);
}

export interface ScaleNote {
  name: string,
  interval: number
}


@Component({
  selector: 'app-composer',
  templateUrl: './composer.component.html',
  styleUrls: ['./composer.component.css']
})

export class ComposerComponent implements OnInit {
  scaleTypes: ScaleType[];
  notesPossibles: string[] = ['C', 'Db', 'D', 'Eb', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  selectedScaleType: ScaleType;
  chromas: number[];
  notes: string[];
  selectedNote: string = 'C';
  chords: string[];
  private scaleNotes: ScaleNote[];

  constructor() {
    this.scaleTypes = ScaleDictionary.all().sort(sortByTypeAndName);
    this.selectedScaleType = ScaleDictionary.get('major');
    this.chromas = [];
    this.notes = [];
    this.chords = [];
    this.scaleNotes = [];
  }

  ngOnInit(): void {
    // this.scaleTypes.forEach(scale => {
    //   console.log(scale.name + ' : ' + scale.intervals.length);
    // });
    this.onScaleTypeSelectionChange();
  }

  onScaleTypeSelectionChange(): void {
    this.setNotesFromSelectedScale();
    console.log(this.notes);
    this.scaleNotes.forEach(note => console.log(note.name + ', '+note.interval));
    this.setChromasFromSelectedScale();
    this.setChordsFromSelectedScale(5);
    console.log(this.chords);

  }


  private setNotesFromSelectedScale(): void {
    this.scaleNotes = [];
    Scale.get(this.selectedNote + " " + this.selectedScaleType.name).notes.forEach((note, index) => {
      this.scaleNotes.push({
        name: note,
        interval: +this.selectedScaleType.intervals[index][0]
      })
    });
    this.scaleNotes.push({
      name: this.scaleNotes[0].name + '1',
      interval: 8
    });
  }

  setChromasFromSelectedScale(): void {
    let previousNote: string = this.selectedNote;
    this.chromas.length = 0;
    this.scaleNotes.forEach((note, index) => {
      if (index > 0) {
        previousNote = this.scaleNotes[index - 1].name;
        const chroma: number = +Interval.get(Interval.distance(previousNote, note.name)).semitones!;
        this.chromas.push(chroma ? chroma * 0.5 : NaN);
      }
    });
  }


  getChordFromNotes(notes: string[]): string {
    const chord = Chord.detect(notes);
    return chord[0];
  }


  setChordsFromSelectedScale(intervalMax: number): void {
    let loopedNotesArray: ScaleNote[] = [];
    this.scaleNotes.slice(0, this.scaleNotes.length-1)  // on ne veut pas le C1 de C,D,E,F,G,A,B,C1
      .forEach((note: ScaleNote) => loopedNotesArray.push({name: note.name, interval: note.interval}));
    this.scaleNotes
      .forEach((note: ScaleNote) => loopedNotesArray.push({name: note.name, interval: note.interval+7}));
    let chordNotes: string[] = [];
    let chord: string;
    let max: number = (intervalMax < 5 ? 5 : intervalMax > 13 ? 13 : intervalMax)
    this.chords.length = 0;
    for (let scaleNoteIndex = 0; scaleNoteIndex < this.scaleNotes.length - 1; scaleNoteIndex++) {
      chordNotes = [];
      for (let interval = 1; interval <= max; interval+=2){
        let note: ScaleNote = this.getScaleNoteFromIntervalNumber(loopedNotesArray, this.scaleNotes[scaleNoteIndex], interval);
        if (note !== undefined && note !== null){
          chordNotes.push(note.name);
          console.log("found note "+note.name + ' for +' + interval + ' from root ' + this.scaleNotes[scaleNoteIndex].name);
        }
        else{
          console.log('no note found for +' + interval + ' from root ' + this.scaleNotes[scaleNoteIndex].name);
        }
      }
      chord = this.getChordFromNotes(chordNotes);
      this.chords.push(chord);
    }
  }

  getScaleNoteFromIntervalNumber(scaleNotes: ScaleNote[], rootNote: ScaleNote, intervalNumber: number): ScaleNote {
    console.log('scaleNotes.length ' + scaleNotes.length);
    for (let i = 0 ; i < scaleNotes.length; i++) {
      console.log('rootNote '+ rootNote.name +', intervalNumber '+intervalNumber+', scaleNotes['+i+']');
      if (scaleNotes[i].name === rootNote.name && scaleNotes[i].interval === rootNote.interval) {
        let tmp: ScaleNote = scaleNotes.find(note => {
          console.log('note '+note.name+', '+note.interval + ' // scaleNotes['+i+'] '+scaleNotes[i].name + ', interval '+scaleNotes[i].interval);
          let test: boolean = note.interval - scaleNotes[i].interval === intervalNumber - 1;
          return (test);
          })!;
        return tmp;
      }
    }
    return rootNote;
  }

  getChordQuality(chord: string): string {
    return Chord.get(chord).quality.toLowerCase();
  }

}